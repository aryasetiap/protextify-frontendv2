import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components";

export default function ClassDetail() {
  return (
    <Container className="py-6">
      <Card>
        <CardHeader>
          <CardTitle>Detail Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Detail kelas dengan member management - akan diimplementasi di Phase
            6
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
