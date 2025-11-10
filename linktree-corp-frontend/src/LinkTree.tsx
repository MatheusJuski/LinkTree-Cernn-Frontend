import React, { useEffect, useState } from 'react';
import useNetworkDetection from './useNetworkDetection';
import { Globe, Lock, X, ChevronRight } from 'lucide-react';
import { cn } from './lib/utils.ts';


// URL base da sua API de Links (Express/Prisma)
const BASE_API_URL = process.env.REACT_APP_API_URL;

const API_URL = `${BASE_API_URL}/api/links`;

interface Link {
  id: string | number;
  titulo: string;
  url: string;
  departamento?: string;
  tipo_acesso: 'interno' | 'publico';
}

interface LinkGroupProps {
  title: string;
  links: Link[];
  onOpenDrawer: (links: Link[], title: string) => void;
}

const LinkGroup = ({ title, links, onOpenDrawer }: LinkGroupProps) => {
  const internos = links.filter(l => l.tipo_acesso === 'interno').length;
  const publicos = links.filter(l => l.tipo_acesso === 'publico').length;

  return (
    <button
      onClick={() => onOpenDrawer(links, title)}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-card/50 p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-border/50 backdrop-blur-sm w-full"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Globe className="w-4 h-4 text-accent" />
            {publicos} público{publicos !== 1 ? 's' : ''}
          </span>
          {internos > 0 && (
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-primary" />
              {internos} interno{internos !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="mt-3 text-xs font-medium text-muted-foreground">
          {links.length} link{links.length !== 1 ? 's' : ''} disponíve{links.length !== 1 ? 'is' : 'l'}
        </div>
      </div>

      {/* Efeito de gradiente no hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary-glow/5 transition-all duration-300" />
    </button>
  );
};

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: Link[];
  title: string;
}

const Drawer = ({ isOpen, onClose, links, title }: DrawerProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 animate-slide-in-right overflow-hidden shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative p-6 border-b border-border bg-gradient-to-r from-primary/10 to-primary-glow/10">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-lg hover:bg-background/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-foreground pr-12">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {links.length} link{links.length !== 1 ? 's' : ''} disponíve{links.length !== 1 ? 'is' : 'l'}
            </p>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {links.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative overflow-hidden rounded-lg bg-gradient-to-br from-secondary/50 to-secondary/30 p-4 hover:from-secondary hover:to-secondary/50 border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors flex-1">
                      {link.titulo}
                    </span>
                    <span className={cn(
                      "flex items-center gap-1 text-xs px-2 py-1 rounded-full shrink-0",
                      link.tipo_acesso === 'interno' 
                        ? "bg-primary/20 text-primary" 
                        : "bg-accent/20 text-accent"
                    )}>
                      {link.tipo_acesso === 'interno' ? (
                        <>
                          <Lock className="w-3 h-3" />
                          Interno
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3" />
                          Público
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const LinkTree = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState<Link[]>([]);
  const [selectedTitle, setSelectedTitle] = useState('');

  const { isInternalNetwork, isLoading: isNetworkDetecting } = useNetworkDetection();

  // Busca dos Links
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(err => {
        console.error("Erro ao carregar links:", err);
        // Dados de exemplo para desenvolvimento
        setLinks([
          { id: 1, titulo: 'Sistema Interno', url: '#', departamento: 'TI', tipo_acesso: 'interno' },
          { id: 2, titulo: 'Portal Web', url: '#', departamento: 'TI', tipo_acesso: 'publico' },
          { id: 3, titulo: 'Dashboard', url: '#', departamento: 'Gestão', tipo_acesso: 'interno' },
          { id: 4, titulo: 'Documentação', url: '#', departamento: 'TI', tipo_acesso: 'publico' },
        ]);
      })
      .finally(() => setLinksLoading(false));
  }, []);

  const groupLinksByDepartment = (links: Link[]) => {
    return links.reduce((acc, link) => {
      const dept = link.departamento || 'Outros';
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(link);
      return acc;
    }, {} as Record<string, Link[]>);
  };

  const linksParaExibir = links.filter(link => {
    if (!isInternalNetwork) {
      return link.tipo_acesso === 'publico';
    }
    return true;
  });

  const groupedLinks = groupLinksByDepartment(linksParaExibir);
  const departmentNames = Object.keys(groupedLinks).sort();

  const handleOpenDrawer = (links: Link[], title: string) => {
    setSelectedLinks(links);
    setSelectedTitle(title);
    setDrawerOpen(true);
  };

  if (isNetworkDetecting || linksLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-scale-in">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando e verificando rede...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradiente animado */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-primary-glow/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-scale-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent mb-4">
           CERNN links
          </h1>
        </div>

        {/* Alerta de rede externa */}
        {!isInternalNetwork && (
          <div className="mb-8 p-4 bg-accent/10 border border-accent/30 rounded-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-accent shrink-0" />
              <p className="text-sm text-accent-foreground">
                Você está fora da rede. Os links internos estão ocultos.
              </p>
            </div>
          </div>
        )}

        {/* Grid de departamentos */}
        <div className="grid gap-4 md:grid-cols-2">
          {departmentNames.map((deptName, index) => (
            <div
              key={deptName}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LinkGroup
                title={deptName}
                links={groupedLinks[deptName]}
                onOpenDrawer={handleOpenDrawer}
              />
            </div>
          ))}
        </div>

        {/* Mensagem se não houver links */}
        {linksParaExibir.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-muted-foreground text-lg">
              Nenhum link disponível no momento.
            </p>
          </div>
        )}
      </div>

      {/* Drawer lateral */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={selectedLinks}
        title={selectedTitle}
      />
    </div>
  );
};

export default LinkTree;

