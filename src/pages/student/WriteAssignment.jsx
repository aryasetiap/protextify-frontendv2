import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function WriteAssignment() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Tulis Tugas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Editor tugas dengan real-time features - akan diimplementasi di
            Phase 8
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
