import { useState } from 'react';
import { Map, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type TimeRangeFilter = 
  | '0-5'    // 0-5 dias
  | '5-15'   // 5-15 dias
  | '15-25'  // 15-25 dias
  | '25-35'  // 25-35 dias
  | '35-44'  // 35-44 dias
  | '45+'    // >45 dias (atrasado)
  | 'custom' // Personalizado
  | null;    // Todos

interface MapLegendProps {
  activeFilter: TimeRangeFilter;
  onFilterChange: (filter: TimeRangeFilter) => void;
  customDate?: Date;
  onCustomDateChange?: (date: Date | undefined) => void;
}

const timeRanges = [
  { value: '0-5' as const, label: '0-5 dias', sublabel: 'Recém roçado', color: '#d1fae5' },
  { value: '5-15' as const, label: '5-15 dias', sublabel: 'Recente', color: '#a7f3d0' },
  { value: '15-25' as const, label: '15-25 dias', sublabel: 'Médio', color: '#6ee7b7' },
  { value: '25-35' as const, label: '25-35 dias', sublabel: 'Próximo', color: '#34d399' },
  { value: '35-44' as const, label: '35-44 dias', sublabel: 'Muito próximo', color: '#10b981' },
  { value: '45+' as const, label: 'Mais de 45 dias', sublabel: 'Atrasado', color: '#ef4444' },
];

export function MapLegend({ 
  activeFilter, 
  onFilterChange, 
  customDate, 
  onCustomDateChange 
}: MapLegendProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleFilterClick = (filter: TimeRangeFilter) => {
    // Se clicar no filtro ativo, desativa (volta para null)
    if (activeFilter === filter) {
      onFilterChange(null);
    } else {
      onFilterChange(filter);
    }
  };

  return (
    <Card className="w-full" data-testid="card-map-legend">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Map className="h-5 w-5" />
          Filtros do Mapa
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="text-xs font-semibold opacity-80">Tempo desde última roçagem</div>
          <div className="text-[10px] opacity-60 mb-2">Clique para filtrar as áreas</div>
          
          {/* Botão "Todos" */}
          <Button
            variant={activeFilter === null ? "default" : "outline"}
            size="sm"
            className="w-full justify-start text-xs h-auto py-2"
            onClick={() => handleFilterClick(null)}
            data-testid="filter-all"
          >
            <div className="flex items-center gap-2 w-full">
              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
              <div className="flex-1 text-left">
                <div className="font-medium">Todas as áreas</div>
              </div>
            </div>
          </Button>

          {/* Filtros por faixa de tempo */}
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={activeFilter === range.value ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs h-auto py-2"
              onClick={() => handleFilterClick(range.value)}
              data-testid={`filter-${range.value}`}
            >
              <div className="flex items-center gap-2 w-full">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: range.color }}
                ></div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{range.label}</div>
                  <div className="text-[10px] opacity-70">{range.sublabel}</div>
                </div>
              </div>
            </Button>
          ))}

          <Separator className="my-2" />

          {/* Filtro personalizado com data */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={activeFilter === 'custom' ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs h-auto py-2"
                data-testid="filter-custom"
              >
                <div className="flex items-center gap-2 w-full">
                  <Calendar className="w-3 h-3" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Personalizado</div>
                    {customDate && (
                      <div className="text-[10px] opacity-70">
                        {format(customDate, 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={customDate}
                onSelect={(date) => {
                  // Passar a data diretamente ao invés de depender de estado assíncrono
                  if (date && onCustomDateChange) {
                    onCustomDateChange(date);
                    // Não chamar onFilterChange aqui - deixar o pai gerenciar
                  }
                  setIsCalendarOpen(false);
                }}
                locale={ptBR}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
              style={{backgroundColor: "hsl(var(--team-capina))"}}
            >
              CP
            </div>
            <span>Capina</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
