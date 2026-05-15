import { PrismaClient, Role, GameStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create an Admin User with a Profile
  const admin = await prisma.user.upsert({
    where: { email: "admin@xiangqi.com" },
    update: {}, // Do nothing if it already exists
    create: {
      email: "admin@xiangqi.com",
      password: "hashed_password_here", // Note: In a real app, hash this beforehand!
      role: Role.ADMIN,
      profile: {
        create: {
          username: "AdminMaster",
          elo: 2000,
        },
      },
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create a Normal User with a Profile
  const player1 = await prisma.user.upsert({
    where: { email: "player1@test.com" },
    update: {},
    create: {
      email: "player1@test.com",
      password: "hashed_password_here",
      role: Role.USER,
      profile: {
        create: {
          username: "XiangqiNoob",
          elo: 1200,
        },
      },
    },
  });
  console.log(`Created player 1: ${player1.email}`);

  // 3. Create a Bot User with a Profile
  const bot = await prisma.user.upsert({
    where: { email: "bot@xiangqi.com" },
    update: {},
    create: {
      email: "bot@xiangqi.com",
      role: Role.BOT,
      profile: {
        create: {
          username: "AlphaXiangqi",
          elo: 2800,
        },
      },
    },
  });
  console.log(`Created bot: ${bot.email}`);

  // Fetch the profiles to create an initial game
  const p1Profile = await prisma.profile.findUnique({
    where: { userId: player1.id },
  });
  const botProfile = await prisma.profile.findUnique({
    where: { userId: bot.id },
  });

  // 4. Create a sample ONGOING game between Player 1 (Red) and the Bot (Black)
  if (p1Profile && botProfile) {
    const existingGame = await prisma.game.findFirst({
      where: { redPlayerId: p1Profile.id, blackPlayerId: botProfile.id },
    });

    if (!existingGame) {
      const game = await prisma.game.create({
        data: {
          status: GameStatus.ONGOING,
          redPlayerId: p1Profile.id,
          blackPlayerId: botProfile.id,
          // FEN and createdAt fall back to their default values in the schema
        },
      });
      console.log(`Created sample game with ID: ${game.id}`);
    } else {
      console.log(`Sample game already exists.`);
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
