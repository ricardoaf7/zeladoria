import { useState, useRef, useEffect, useMemo } from "react";
import { DashboardMap } from "@/components/DashboardMap";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { BottomSheet, type BottomSheetState } from "@/components/BottomSheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import type { ServiceArea, Team, AppConfig } from "@shared/schema";
import type { FilterCriteria } from "@/components/FilterPanel";
import type { TimeRangeFilter } from "@/components/MapLegend";
import L from "leaflet";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [isRegistrationMode, setIsRegistrationMode] = useState(false);
  const [selectedAreaIds, setSelectedAreaIds] = useState<Set<number>>(new Set());
  const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>("minimized");
  const [filters, setFilters] = useState<FilterCriteria>({
    search: "",
    bairro: "all",
    lote: "all",
    status: "all",
    tipo: "all",
  });
  const [timeRangeFilter, setTimeRangeFilter] = useState<TimeRangeFilter>(null);
  const [customFilterDate, setCustomFilterDate] = useState<Date | undefined>();
  const mapRef = useRef<L.Map | null>(null);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    if (isMobile && bottomSheetState === "minimized") {
      setBottomSheetState("medium");
    }
  };

  const { data: rocagemAreas = [] } = useQuery<ServiceArea[]>({
    queryKey: ["/api/areas/rocagem"],
  });

  const { data: jardinsAreas = [] } = useQuery<ServiceArea[]>({
    queryKey: ["/api/areas/jardins"],
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: config } = useQuery<AppConfig>({
    queryKey: ["/api/config"],
  });

  // Função auxiliar para calcular dias desde última roçagem
  const getDaysSinceLastMowing = (area: ServiceArea): number => {
    if (area.history.length === 0) return -1;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastHistory = area.history[area.history.length - 1];
    const lastDate = new Date(lastHistory.date);
    lastDate.setHours(0, 0, 0, 0);
    
    return Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Filtrar áreas baseado nos critérios (incluindo filtro de tempo)
  const filteredRocagemAreas = useMemo(() => {
    let areas = rocagemAreas;

    // Aplicar filtro de tempo primeiro
    if (timeRangeFilter) {
      areas = areas.filter(area => {
        const days = getDaysSinceLastMowing(area);
        
        // Se não tem histórico, não mostra em nenhum filtro de tempo
        if (days === -1) return false;

        switch (timeRangeFilter) {
          case '0-5':
            return days >= 0 && days <= 5;
          case '5-15':
            return days > 5 && days <= 15;
          case '15-25':
            return days > 15 && days <= 25;
          case '25-35':
            return days > 25 && days <= 35;
          case '35-44':
            return days > 35 && days <= 44;
          case '45+':
            return days > 44;
          case 'custom':
            if (!customFilterDate) return false;
            const filterDate = new Date(customFilterDate);
            filterDate.setHours(0, 0, 0, 0);
            const lastHistory = area.history[area.history.length - 1];
            const lastDate = new Date(lastHistory.date);
            lastDate.setHours(0, 0, 0, 0);
            return lastDate.getTime() === filterDate.getTime();
          default:
            return true;
        }
      });
    }

    // Aplicar filtros tradicionais
    if (!filters.search && 
        (!filters.bairro || filters.bairro === "all") && 
        (!filters.lote || filters.lote === "all") && 
        (!filters.status || filters.status === "all") && 
        (!filters.tipo || filters.tipo === "all")) {
      return areas;
    }

    return areas.filter(area => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const endereco = area.endereco?.toLowerCase() || "";
        const bairro = area.bairro?.toLowerCase() || "";
        if (!endereco.includes(searchLower) && !bairro.includes(searchLower)) {
          return false;
        }
      }

      if (filters.bairro && filters.bairro !== "all" && area.bairro !== filters.bairro) return false;
      if (filters.lote && filters.lote !== "all" && area.lote?.toString() !== filters.lote) return false;
      if (filters.status && filters.status !== "all" && area.status !== filters.status) return false;
      if (filters.tipo && filters.tipo !== "all" && area.tipo !== filters.tipo) return false;

      return true;
    });
  }, [rocagemAreas, filters, timeRangeFilter, customFilterDate]);

  const hasActiveFilters = filters.search || 
    (filters.bairro && filters.bairro !== "all") || 
    (filters.lote && filters.lote !== "all") || 
    (filters.status && filters.status !== "all") || 
    (filters.tipo && filters.tipo !== "all") ||
    timeRangeFilter !== null;

  useEffect(() => {
    if (selectedArea && mapRef.current) {
      const lat = selectedArea.lat;
      const lng = selectedArea.lng;
      
      if (lat && lng) {
        mapRef.current.panTo([lat, lng], { animate: true });
        if (selectedArea.polygon) {
          mapRef.current.setZoom(16);
        }
      }
    }
  }, [selectedArea]);

  // Largura responsiva: 85% em mobile, 21rem em desktop
  const style = {
    "--sidebar-width": "min(85vw, 21rem)",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  const handleAreaClick = (area: ServiceArea) => {
    if (selectionMode) {
      setSelectedAreaIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(area.id)) {
          newSet.delete(area.id);
        } else {
          newSet.add(area.id);
        }
        return newSet;
      });
    } else {
      setSelectedArea(area);
    }
  };

  const handleAreaUpdate = (updatedArea: ServiceArea) => {
    setSelectedArea(updatedArea);
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
    if (selectionMode) {
      setSelectedAreaIds(new Set());
    }
    setSelectedArea(null);
    setIsRegistrationMode(false);
  };

  const handleRegistrationModeChange = (isActive: boolean) => {
    setIsRegistrationMode(isActive);
    setSelectionMode(isActive);
    if (!isActive) {
      setSelectedAreaIds(new Set());
    }
    setSelectedArea(null);
  };

  const handleClearSelection = () => {
    setSelectedAreaIds(new Set());
  };

  const handleTimeRangeFilterChange = (filter: TimeRangeFilter, customDate?: Date) => {
    setTimeRangeFilter(filter);
    // Sempre atualizar customFilterDate (undefined para filtros não-custom)
    setCustomFilterDate(customDate);
  };

  // Mobile layout com BottomSheet
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen w-full">
        <header className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border bg-background z-30">
          <h1 className="text-lg font-semibold">Zeladoria LD</h1>
          <ThemeToggle />
        </header>
        
        <main className="flex-1 overflow-hidden relative">
          <DashboardMap
            rocagemAreas={rocagemAreas}
            jardinsAreas={jardinsAreas}
            teams={teams}
            layerFilters={{
              rocagemLote1: selectedService === 'rocagem',
              rocagemLote2: selectedService === 'rocagem',
              jardins: selectedService === 'jardins',
              teamsGiroZero: true,
              teamsAcabamento: true,
              teamsColeta: true,
              teamsCapina: true,
            }}
            onAreaClick={handleAreaClick}
            filteredAreaIds={hasActiveFilters ? new Set(filteredRocagemAreas.map(a => a.id)) : undefined}
            mapRef={mapRef}
            selectionMode={selectionMode}
            selectedAreaIds={selectedAreaIds}
          />
          
          <BottomSheet 
            state={bottomSheetState}
            onStateChange={setBottomSheetState}
          >
            <AppSidebar
              standalone
              selectedService={selectedService}
              onServiceSelect={handleServiceSelect}
              selectedArea={selectedArea}
              onAreaClose={() => setSelectedArea(null)}
              onAreaUpdate={handleAreaUpdate}
              selectionMode={selectionMode}
              onToggleSelectionMode={handleToggleSelectionMode}
              isRegistrationMode={isRegistrationMode}
              onRegistrationModeChange={handleRegistrationModeChange}
              selectedAreaIds={selectedAreaIds}
              onClearSelection={handleClearSelection}
              rocagemAreas={rocagemAreas}
              filters={filters}
              onFilterChange={setFilters}
              filteredCount={filteredRocagemAreas.length}
              onTimeRangeFilterChange={handleTimeRangeFilterChange}
            />
          </BottomSheet>
        </main>
      </div>
    );
  }

  // Desktop layout com Sidebar
  return (
    <SidebarProvider 
      style={style as React.CSSProperties}
      defaultOpen={typeof window !== 'undefined' && window.innerWidth > 1024}
    >
      <div className="flex h-screen w-full">
        <AppSidebar
          selectedService={selectedService}
          onServiceSelect={handleServiceSelect}
          selectedArea={selectedArea}
          onAreaClose={() => setSelectedArea(null)}
          onAreaUpdate={handleAreaUpdate}
          selectionMode={selectionMode}
          onToggleSelectionMode={handleToggleSelectionMode}
          isRegistrationMode={isRegistrationMode}
          onRegistrationModeChange={handleRegistrationModeChange}
          selectedAreaIds={selectedAreaIds}
          onClearSelection={handleClearSelection}
          rocagemAreas={rocagemAreas}
          filters={filters}
          onFilterChange={setFilters}
          filteredCount={filteredRocagemAreas.length}
          onTimeRangeFilterChange={handleTimeRangeFilterChange}
        />
        
        <SidebarInset className="flex-1 overflow-hidden">
          <header className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="h-[calc(100vh-3.5rem)] overflow-hidden">
            <DashboardMap
              rocagemAreas={rocagemAreas}
              jardinsAreas={jardinsAreas}
              teams={teams}
              layerFilters={{
                rocagemLote1: selectedService === 'rocagem',
                rocagemLote2: selectedService === 'rocagem',
                jardins: selectedService === 'jardins',
                teamsGiroZero: true,
                teamsAcabamento: true,
                teamsColeta: true,
                teamsCapina: true,
              }}
              onAreaClick={handleAreaClick}
              filteredAreaIds={hasActiveFilters ? new Set(filteredRocagemAreas.map(a => a.id)) : undefined}
              mapRef={mapRef}
              selectionMode={selectionMode}
              selectedAreaIds={selectedAreaIds}
            />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
