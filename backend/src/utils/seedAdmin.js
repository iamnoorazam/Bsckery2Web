import bcrypt from "bcryptjs";
import userRepository from "../repositories/user.repository.js";

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@bakery.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "Admin";

  if (!adminEmail || !adminPassword) return;

  const existing = await userRepository.findByEmail(adminEmail);
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  if (existing) {
    if (existing.role !== "admin") {
      console.warn(
        `Existing account with admin email is not an admin: ${adminEmail}`,
      );
      return;
    }

    await userRepository.updateById(existing._id, {
      name: adminName,
      password: hashedPassword,
      role: "admin",
    });
    return;
  }

  await userRepository.create({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });

};

export default seedAdmin;
