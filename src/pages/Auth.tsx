import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Bike, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated authentication - will be replaced with real auth later
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isLogin ? 'Login realizado!' : 'Conta criada!',
        description: 'Redirecionando para o dashboard...',
      });
      navigate('/dashboard');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Bike className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DeliveryControl</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Entre para acessar seu painel de controle.' 
                : 'Comece a gerenciar seu delivery agora mesmo.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                'Carregando...'
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Criar conta'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? 'Criar conta' : 'Entrar'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-warning/10 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="h-32 w-32 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-8 glow-primary">
            <Bike className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Gerencie seu delivery com eficiência
          </h2>
          <p className="text-muted-foreground">
            Controle motoboys, otimize rotas e monitore entregas em tempo real. 
            Tudo isso em uma interface simples e intuitiva.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="glass rounded-xl px-4 py-2">
              <div className="text-xl font-bold text-primary">500+</div>
              <div className="text-xs text-muted-foreground">Lojas ativas</div>
            </div>
            <div className="glass rounded-xl px-4 py-2">
              <div className="text-xl font-bold text-success">10k+</div>
              <div className="text-xs text-muted-foreground">Entregas/dia</div>
            </div>
            <div className="glass rounded-xl px-4 py-2">
              <div className="text-xl font-bold text-warning">99%</div>
              <div className="text-xs text-muted-foreground">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
