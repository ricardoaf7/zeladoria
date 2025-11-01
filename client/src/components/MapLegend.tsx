import { Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function MapLegend() {
  return (
    <Card className="w-full" data-testid="card-map-legend">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Map className="h-5 w-5" />
          Legenda do Mapa
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="text-xs font-semibold opacity-80">Status das Áreas</div>
          
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-map-executing animate-pulse"></div>
            <span>Em Execução</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-map-today"></div>
            <span>Hoje</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-map-next3days"></div>
            <span>Próximos 3 Dias</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-map-thisWeek"></div>
            <span>Esta Semana</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-map-completedRecent"></div>
            <span>Concluído Recente</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-map-pending"></div>
            <span>Pendente</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-xs font-semibold opacity-80">Tipos de Equipe</div>
          
          <div className="flex items-center gap-2 text-xs">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white shadow-sm" 
              style={{backgroundColor: "hsl(var(--team-giro-zero))"}}
            >
              GZ
            </div>
            <span>Giro Zero</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white shadow-sm" 
              style={{backgroundColor: "hsl(var(--team-acabamento))"}}
            >
              AC
            </div>
            <span>Acabamento</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white shadow-sm" 
              style={{backgroundColor: "hsl(var(--team-coleta))"}}
            >
              CO
            </div>
            <span>Coleta</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white border border-white shadow-sm" 
              style={{backgroundColor: "hsl(var(--team-touceiras))"}}
            >
              TC
            </div>
            <span>Touceiras</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
