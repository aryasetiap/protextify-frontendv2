import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function StudentSubmissions() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengumpulan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Riwayat submission student - akan diimplementasi di Phase 8
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
