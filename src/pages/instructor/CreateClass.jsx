import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function CreateClass() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Buat Kelas Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Form buat kelas baru - akan diimplementasi di Phase 6
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
