import { useState } from "react";
import { cn, formatDate } from "@/utils";
import { BRAND_COLORS } from "@/utils/constants";
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

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <Container className="py-6">
          <Stack direction="row" justify="between" align="center">
            <div>
              <h1 className="heading-3 text-brand">
                Protextify Component Library
              </h1>
              <p className="body-small text-muted">
                Testing Phase 1.3 Implementation
              </p>
            </div>
            <Stack direction="row" spacing={3}>
              <span className="badge badge-primary">Phase 1.3</span>
              <span className="badge badge-success">Complete</span>
            </Stack>
          </Stack>
        </Container>
      </header>

      {/* Main Content */}
      <main>
        <Container className="content-padding">
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

                  {/* Sizes */}
                  <div>
                    <h4 className="heading-6 mb-3">Sizes</h4>
                    <Stack direction="row" spacing={3} align="center" wrap>
                      <Button size="xs">Extra Small</Button>
                      <Button size="sm">Small</Button>
                      <Button size="md">Medium</Button>
                      <Button size="lg">Large</Button>
                      <Button size="xl">Extra Large</Button>
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
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </Select>

                  <Textarea
                    label="Description"
                    placeholder="Enter description"
                    rows={3}
                    helperText="Maximum 500 characters"
                  />
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
                    Your data has been saved successfully.
                  </Alert>

                  <Alert variant="warning" title="Warning">
                    Please check your input before submitting.
                  </Alert>

                  <Alert
                    variant="error"
                    title="Error"
                    closable
                    onClose={() => {}}
                  >
                    There was an error processing your request.
                  </Alert>

                  <Alert variant="info">
                    This is some helpful information for you.
                  </Alert>
                </Stack>
              </CardContent>
            </Card>

            {/* Modal & Loading */}
            <Card>
              <CardHeader>
                <CardTitle>Modal & Loading</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing={4}>
                  <Button onClick={() => setShowModal(true)}>Open Modal</Button>

                  <div>
                    <h4 className="heading-6 mb-3">Loading Spinners</h4>
                    <Stack direction="row" spacing={4} align="center">
                      <LoadingSpinner size="xs" />
                      <LoadingSpinner size="sm" />
                      <LoadingSpinner size="md" />
                      <LoadingSpinner size="lg" />
                      <LoadingSpinner size="xl" />
                    </Stack>
                  </div>

                  <div>
                    <h4 className="heading-6 mb-3">Skeleton</h4>
                    <SkeletonCard />
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Layout Components */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Layout Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing={6}>
                  {/* Grid Layout */}
                  <div>
                    <h4 className="heading-6 mb-3">Grid Layout</h4>
                    <Grid cols={1} smCols={2} lgCols={4} gap={4}>
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="bg-[#23407a] text-white p-4 rounded-lg text-center"
                        >
                          Grid Item {item}
                        </div>
                      ))}
                    </Grid>
                  </div>

                  {/* Stack Layout */}
                  <div>
                    <h4 className="heading-6 mb-3">Stack Layout</h4>
                    <Stack direction="row" spacing={4} justify="center" wrap>
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
                        Stack Item 1
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded">
                        Stack Item 2
                      </div>
                      <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded">
                        Stack Item 3
                      </div>
                    </Stack>
                  </div>

                  {/* Counter Demo */}
                  <div className="text-center">
                    <h4 className="heading-6 mb-3">Interactive Demo</h4>
                    <Stack direction="column" spacing={4} align="center">
                      <p className="body-regular">
                        Count is{" "}
                        <span className="font-semibold text-brand">
                          {count}
                        </span>
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
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </main>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        description="This is a modal component demonstration"
        size="md"
      >
        <Stack spacing={4}>
          <p className="body-regular">
            This is the modal content. You can put any content here like forms,
            confirmations, or detailed information.
          </p>

          <Alert variant="info">
            This modal can be closed by clicking the X button, pressing Escape,
            or clicking outside the modal.
          </Alert>

          <Stack direction="row" spacing={3} justify="end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowModal(false)}>Confirm</Button>
          </Stack>
        </Stack>
      </Modal>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <Container className="py-8">
          <div className="text-center space-y-2">
            <p className="body-small text-muted">
              Protextify Component Library v1.3 • Phase 1 Complete
            </p>
            <p className="caption">
              All components ready for development • {formatDate(new Date())}
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default App;
