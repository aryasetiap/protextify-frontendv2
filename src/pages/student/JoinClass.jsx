import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function JoinClass() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Gabung Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Form gabung kelas dengan token - akan diimplementasi di Phase 6
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
