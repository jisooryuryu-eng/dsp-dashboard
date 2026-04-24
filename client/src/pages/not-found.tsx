import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="text-6xl font-bold text-muted-foreground/20 mb-4">404</div>
      <h2 className="text-lg font-semibold mb-2">페이지를 찾을 수 없습니다</h2>
      <p className="text-sm text-muted-foreground mb-6">요청하신 페이지가 존재하지 않습니다.</p>
      <Button asChild>
        <Link href="/">
          <Home className="w-4 h-4 mr-2" />
          대시보드로 돌아가기
        </Link>
      </Button>
    </div>
  );
}
