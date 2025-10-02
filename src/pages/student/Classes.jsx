import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function StudentClasses() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Kelas Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Halaman daftar kelas student - akan diimplementasi di Phase 6
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
