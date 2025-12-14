import { Link } from 'react-router-dom';
import { Bike, MapPin, Package, Users, Clock, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: 'Gestão de Motoboys',
      description: 'Controle completo dos entregadores do dia, status e desempenho individual.',
    },
    {
      icon: Package,
      title: 'Controle de Pedidos',
      description: 'Gerencie pedidos em tempo real, desde a criação até a entrega final.',
    },
    {
      icon: MapPin,
      title: 'Otimização de Rotas',
      description: 'Sugestões inteligentes de rotas para maximizar a eficiência das entregas.',
    },
    {
      icon: Clock,
      title: 'Monitoramento SLA',
      description: 'Acompanhe o tempo de espera de cada pedido e mantenha a qualidade.',
    },
  ];

  const benefits = [
    'Aumente a produtividade dos motoboys',
    'Reduza custos com combustível',
    'Melhore a satisfação do cliente',
    'Tenha visão completa das operações',
    'Integração futura com Zé Delivery',
    'Relatórios e estatísticas em tempo real',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Bike className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">DeliveryControl</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/login?mode=signup">
                <Button>Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-warning/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground">Sistema completo de gestão de delivery</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Controle suas entregas com{' '}
              <span className="text-gradient">inteligência</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Gerencie motoboys, otimize rotas e monitore pedidos em tempo real. 
              Tudo o que você precisa para um delivery eficiente.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login?mode=signup">
                <Button size="lg" className="gap-2 glow-primary">
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades pensadas para otimizar cada aspecto da sua operação de delivery.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 hover:border-primary/50 transition-colors group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Por que escolher o{' '}
                <span className="text-gradient">DeliveryControl</span>?
              </h2>
              <p className="text-muted-foreground mb-8">
                Nossa plataforma foi desenvolvida pensando nas necessidades reais de 
                operações de delivery, com foco em simplicidade e eficiência.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-xl bg-primary/10">
                  <div className="text-4xl font-bold text-primary mb-1">50%</div>
                  <div className="text-sm text-muted-foreground">Menos tempo ocioso</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-success/10">
                  <div className="text-4xl font-bold text-success mb-1">30%</div>
                  <div className="text-sm text-muted-foreground">Mais entregas/dia</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-warning/10">
                  <div className="text-4xl font-bold text-warning mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">Entregas no prazo</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-accent/10">
                  <div className="text-4xl font-bold text-accent mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Monitoramento</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8 md:p-12 text-center glow-primary">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para otimizar seu delivery?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Comece agora mesmo e veja a diferença que uma gestão inteligente pode fazer.
            </p>
            <Link to="/login?mode=signup">
              <Button size="lg" className="gap-2">
                Criar Conta Grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Bike className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">DeliveryControl</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DeliveryControl. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
