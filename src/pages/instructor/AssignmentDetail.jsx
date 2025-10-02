import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function AssignmentDetail() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Detail Tugas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Detail assignment dengan analytics - akan diimplementasi di Phase 7
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
