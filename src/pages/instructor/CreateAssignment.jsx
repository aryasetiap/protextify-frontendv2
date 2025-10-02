import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function CreateAssignment() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Buat Tugas Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Form buat assignment dengan payment - akan diimplementasi di Phase 7
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
