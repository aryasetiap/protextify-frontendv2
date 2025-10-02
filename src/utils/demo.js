export const DEMO_CREDENTIALS = {
  STUDENT: {
    email: "student@example.com",
    password: "password123",
    fullName: "Demo Student",
    role: "STUDENT",
    institution: "Demo University",
  },
  INSTRUCTOR: {
    email: "instructor@example.com",
    password: "password123",
    fullName: "Demo Instructor",
    role: "INSTRUCTOR",
    institution: "Demo University",
  },
};

export const getDemoCredentials = (role) => {
  return DEMO_CREDENTIALS[role.toUpperCase()] || null;
};

export const fillDemoData = (setValue, role) => {
  const credentials = getDemoCredentials(role);
  if (credentials) {
    setValue("email", credentials.email);
    setValue("password", credentials.password);
  }
};
