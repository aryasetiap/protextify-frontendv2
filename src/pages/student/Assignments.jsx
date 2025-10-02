import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function StudentAssignments() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Tugas Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Daftar tugas student - akan diimplementasi di Phase 7
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
