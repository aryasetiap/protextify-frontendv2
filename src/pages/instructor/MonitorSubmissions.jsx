import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function MonitorSubmissions() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitor Pengumpulan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Real-time monitoring submissions - akan diimplementasi di Phase 7
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
