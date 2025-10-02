import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function InstructorClasses() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Kelola Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Halaman kelola kelas instructor - akan diimplementasi di Phase 6
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
