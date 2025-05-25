import { Card, CardContent } from '@/components/ui/card';

export function NoLinks() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <p className="text-muted-foreground">
          No links yet. Add some links above!
        </p>
      </CardContent>
    </Card>
  );
}
