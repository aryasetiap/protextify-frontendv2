import { useState } from "react";
import { cn, formatDate } from "@/utils";
import { BRAND_COLORS, USER_ROLES } from "@/utils/constants";
import { useAuth } from "@/contexts";
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Modal,
  Alert,
  LoadingSpinner,
  SkeletonCard,
  Container,
  Grid,
  Stack,
} from "@/components";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auth testing
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    login,
    logout,
    register,
  } = useAuth();

  const [showAuthDemo, setShowAuthDemo] = useState(false);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleDemoLogin = async () => {
    try {
      await login({
        email: "student@example.com",
        password: "password123",
      });
    } catch (error) {
      console.error("Demo login failed:", error);
    }
  };

  const handleDemoRegister = async () => {
    try {
      await register({
        email: "newuser@example.com",
        password: "Password123",
        fullName: "Demo User",
        role: USER_ROLES.STUDENT,
        institution: "Demo University",
      });
    } catch (error) {
      console.error("Demo register failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <Container className="py-6">
          <Stack direction="row" justify="between" align="center">
            <div>
              <h1 className="heading-3 text-brand">
                Protextify Authentication System
              </h1>
              <p className="body-small text-muted">
                Testing Phase 2.1 Implementation
              </p>
            </div>
            <Stack direction="row" spacing={3}>
              <span className="badge badge-primary">Phase 2.1</span>
              <span className="badge badge-success">Auth Ready</span>
            </Stack>
          </Stack>
        </Container>
      </header>

      {/* Main Content */}
      <main>
        <Container className="content-padding">
          {/* Auth Status Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack spacing={4}>
                {authLoading ? (
                  <div className="flex items-center space-x-3">
                    <LoadingSpinner size="sm" />
                    <span>Checking authentication...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isAuthenticated ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium">
                        Status:{" "}
                        {isAuthenticated
                          ? "Authenticated"
                          : "Not Authenticated"}
                      </span>
                    </div>

                    {isAuthenticated && user && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">
                          User Information:
                        </h4>
                        <div className="text-sm text-green-800 space-y-1">
                          <p>
                            <strong>Name:</strong> {user.fullName}
                          </p>
                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>
                          <p>
                            <strong>Role:</strong> {user.role}
                          </p>
                          <p>
                            <strong>Institution:</strong> {user.institution}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Stack direction="row" spacing={3} wrap>
                  {!isAuthenticated ? (
                    <>
                      <Button onClick={handleDemoLogin} variant="primary">
                        Demo Login
                      </Button>
                      <Button onClick={handleDemoRegister} variant="secondary">
                        Demo Register
                      </Button>
                    </>
                  ) : (
                    <Button onClick={logout} variant="danger">
                      Logout
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowAuthDemo(!showAuthDemo)}
                    variant="outline"
                  >
                    {showAuthDemo ? "Hide" : "Show"} Auth Demo
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Auth Demo Section */}
          {showAuthDemo && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Authentication Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing={4}>
                  <Alert variant="info">
                    <p>
                      Authentication system sudah terintegrasi dengan backend
                      API. Context menyediakan state management untuk login,
                      logout, dan user data.
                    </p>
                  </Alert>

                  <div>
                    <h4 className="heading-6 mb-3">Features Implemented:</h4>
                    <Grid cols={1} mdCols={2} gap={4}>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">JWT Token Management</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">
                            Persistent Authentication
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">Auto-refresh Token</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">Protected Routes</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">Role-based Access</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">Error Handling</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">Google OAuth Ready</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">Loading States</span>
                        </div>
                      </div>
                    </Grid>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Original Component Demo */}
          <Grid cols={1} lgCols={2} gap={8}>
            {/* Button Components */}
            <Card>
              <CardHeader>
                <CardTitle>Button Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing={4}>
                  {/* Variants */}
                  <div>
                    <h4 className="heading-6 mb-3">Variants</h4>
                    <Stack direction="row" spacing={3} wrap>
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="danger">Danger</Button>
                      <Button variant="success">Success</Button>
                    </Stack>
                  </div>

                  {/* Loading */}
                  <div>
                    <h4 className="heading-6 mb-3">Loading State</h4>
                    <Stack direction="row" spacing={3}>
                      <Button loading={loading} onClick={handleLoadingTest}>
                        {loading ? "Loading..." : "Test Loading"}
                      </Button>
                      <Button variant="outline" disabled>
                        Disabled
                      </Button>
                    </Stack>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Form Components */}
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing={4}>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    helperText="We'll never share your email"
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    showPasswordToggle
                    required
                  />

                  <Select label="Role" placeholder="Select your role" required>
                    <option value="STUDENT">Student</option>
                    <option value="INSTRUCTOR">Instructor</option>
                  </Select>
                </Stack>
              </CardContent>
            </Card>

            {/* Alert Components */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing={3}>
                  <Alert variant="success" title="Success">
                    Authentication system berhasil diimplementasikan!
                  </Alert>

                  <Alert variant="warning" title="Warning">
                    Pastikan untuk menguji semua fitur auth sebelum deploy.
                  </Alert>

                  <Alert variant="info">
                    Auth Context siap untuk Phase 2.2 - Authentication Pages.
                  </Alert>
                </Stack>
              </CardContent>
            </Card>

            {/* Counter Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Interactive Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Stack direction="column" spacing={4} align="center">
                    <p className="body-regular">
                      Count is{" "}
                      <span className="font-semibold text-brand">{count}</span>
                    </p>
                    <Stack direction="row" spacing={3}>
                      <Button onClick={() => setCount(count + 1)}>
                        Increment
                      </Button>
                      <Button variant="secondary" onClick={() => setCount(0)}>
                        Reset
                      </Button>
                    </Stack>
                  </Stack>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <Container className="py-8">
          <div className="text-center space-y-2">
            <p className="body-small text-muted">
              Protextify Authentication System v2.1 • Phase 2 Ready
            </p>
            <p className="caption">
              Auth Context & Services implemented • {formatDate(new Date())}
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default App;
