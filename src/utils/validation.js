import { z } from "zod";

// Common validation schemas
export const emailSchema = z.string().email("Email tidak valid");

export const passwordSchema = z
  .string()
  .min(6, "Password minimal 6 karakter")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password harus mengandung huruf besar, kecil, dan angka"
  );

export const requiredStringSchema = z.string().min(1, "Field ini wajib diisi");

export const phoneSchema = z
  .string()
  .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, "Nomor telepon tidak valid");

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: requiredStringSchema.min(2, "Nama minimal 2 karakter"),
  role: z.enum(["STUDENT", "INSTRUCTOR"], {
    required_error: "Role wajib dipilih",
  }),
  institution: requiredStringSchema.min(2, "Institusi minimal 2 karakter"),
});

// Class schemas
export const createClassSchema = z.object({
  name: requiredStringSchema.min(3, "Nama kelas minimal 3 karakter"),
  description: z.string().optional(),
});

export const joinClassSchema = z.object({
  classToken: requiredStringSchema.length(8, "Token kelas harus 8 karakter"),
});

// Assignment schemas
export const createAssignmentSchema = z.object({
  title: requiredStringSchema.min(3, "Judul tugas minimal 3 karakter"),
  instructions: requiredStringSchema.min(10, "Instruksi minimal 10 karakter"),
  deadline: z.string().datetime("Deadline tidak valid"),
  expectedStudentCount: z.number().min(1, "Jumlah siswa minimal 1"),
});

// Profile schemas
export const updateProfileSchema = z.object({
  fullName: requiredStringSchema.min(2, "Nama minimal 2 karakter"),
  institution: requiredStringSchema.min(2, "Institusi minimal 2 karakter"),
});
