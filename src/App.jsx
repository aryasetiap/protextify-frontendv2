import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn, formatDate } from "./utils";
import { BRAND_COLORS, USER_ROLES } from "./utils/constants";
import { useAuth } from "./contexts";
import { getDefaultRoute, ROUTES } from "./router/routes";
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
  Container,
  Grid,
  Stack,
} from "./components";
import "./App.css";
import ConnectionStatus from "./components/ui/ConnectionStatus";
import NotificationCenter from "./components/ui/NotificationCenter";
import ToastProvider from "./components/ui/ToastProvider";

function App() {
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Router testing
  const location = useLocation();
  const navigate = useNavigate();

  // Auth testing
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    login,
    logout,
    register,
  } = useAuth();

  const [showRoutingDemo, setShowRoutingDemo] = useState(false);

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

  const navigateToRoute = (route) => {
    navigate(route);
  };

  const testRoutes = [
    { name: "Home", path: ROUTES.HOME },
    { name: "About", path: ROUTES.ABOUT },
    { name: "Login", path: ROUTES.AUTH.LOGIN },
    { name: "Register", path: ROUTES.AUTH.REGISTER },
    { name: "Student Dashboard", path: ROUTES.STUDENT.DASHBOARD },
    { name: "Instructor Dashboard", path: ROUTES.INSTRUCTOR.DASHBOARD },
    { name: "Not Found (404)", path: "/non-existent-page" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Development Mode Notice */}
      <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
        <Container>
          <div className="flex items-center justify-center">
            <p className="text-sm text-yellow-800 font-medium">
              🚧 Development Mode - Router System Active (Phase 3.1)
            </p>
          </div>
        </Container>
      </div>

      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <Container className="py-6">
          <Stack direction="row" justify="between" align="center">
            <div>
              <h1 className="heading-3 text-brand">Protextify Router Test</h1>
              <p className="body-small text-muted">
                Testing Phase 3.1 - Router Setup & Route Structure
              </p>
            </div>
            <Stack direction="row" spacing={3}>
              <span className="badge badge-primary">Phase 3.1</span>
              <span className="badge badge-success">Router Ready</span>
            </Stack>
          </Stack>
        </Container>
      </header>

      {/* Main Content */}
      <main>
        <Container className="content-padding">
          {/* Router Status Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Router Implementation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack spacing={4}>
                <Alert
                  variant="success"
                  title="Router Successfully Configured!"
                >
                  <p>
                    All layout components have been created and router is
                    working properly.
                  </p>
                </Alert>

                <div>
                  <h4 className="heading-6 mb-3">Current Route Information:</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Current Path:</strong>
                        <code className="ml-2 px-2 py-1 bg-blue-100 rounded">
                          {location.pathname}
                        </code>
                      </div>
                      <div>
                        <strong>Search:</strong>
                        <code className="ml-2 px-2 py-1 bg-blue-100 rounded">
                          {location.search || "(none)"}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="heading-6 mb-3">
                    Router Features Implemented:
                  </h4>
                  <Grid cols={1} mdCols={2} gap={4}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">
                          ✅ Layout Components (Header, Footer, Sidebar)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">
                          ✅ Protected Routes dengan Auth Guard
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">
                          ✅ Role-based Routing (Student/Instructor)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">
                          ✅ Nested Route Structure
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">
                          ✅ Error Boundary & 404 Handling
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">✅ Layout-based Routing</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">
                          ✅ Legacy Route Redirects
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">
                          ✅ Dynamic Route Parameters
                        </span>
                      </div>
                    </div>
                  </Grid>
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Authentication Test */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Authentication Testing</CardTitle>
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
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
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
                            <strong>Default Route:</strong>
                            <code className="ml-2 px-2 py-1 bg-green-100 rounded">
                              {getDefaultRoute(user.role)}
                            </code>
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
                    onClick={() => setShowRoutingDemo(!showRoutingDemo)}
                    variant="outline"
                  >
                    {showRoutingDemo ? "Hide" : "Show"} Route Tests
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Route Testing */}
          {showRoutingDemo && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Route Navigation Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing={4}>
                  <Alert variant="info">
                    <p>
                      Test navigasi ke berbagai route. Protected routes akan
                      redirect jika belum authenticated.
                    </p>
                  </Alert>

                  <div>
                    <h4 className="heading-6 mb-3">Available Routes:</h4>
                    <Grid cols={1} mdCols={2} gap={3}>
                      {testRoutes.map((route, index) => (
                        <Button
                          key={index}
                          onClick={() => navigateToRoute(route.path)}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <span className="font-mono text-xs mr-2">
                            {route.path}
                          </span>
                          {route.name}
                        </Button>
                      ))}
                    </Grid>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Original Demo Components */}
          <Grid cols={1} lgCols={2} gap={8}>
            {/* Button Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Button Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing={4}>
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

            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing={3}>
                  <div className="grid grid-cols-2 gap-2">
                    <Link to={ROUTES.HOME}>
                      <Button variant="outline" className="w-full" size="sm">
                        Home
                      </Button>
                    </Link>
                    <Link to={ROUTES.ABOUT}>
                      <Button variant="outline" className="w-full" size="sm">
                        About
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link to={ROUTES.AUTH.LOGIN}>
                      <Button variant="outline" className="w-full" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link to={ROUTES.AUTH.REGISTER}>
                      <Button variant="outline" className="w-full" size="sm">
                        Register
                      </Button>
                    </Link>
                  </div>

                  {isAuthenticated && (
                    <div className="grid grid-cols-1 gap-2">
                      <Link to={getDefaultRoute(user?.role)}>
                        <Button className="w-full" size="sm">
                          Go to Dashboard
                        </Button>
                      </Link>
                    </div>
                  )}
                </Stack>
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
              Protextify Router System v3.1 • Phase 3.1 Complete
            </p>
            <p className="caption">
              Layout Components & Router Structure Complete •{" "}
              {formatDate(new Date())}
            </p>
          </div>
        </Container>
      </footer>

      {/* WebSocket Features */}
      <ConnectionStatus showDetails={false} position="bottom-right" />
      <ToastProvider />

      {/* In your header/navbar */}
      <NotificationCenter />
    </div>
  );
}

export default App;
