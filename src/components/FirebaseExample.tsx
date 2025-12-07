import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFirestore, useCollection } from '@/hooks/useFirestore';
import { useStorage } from '@/hooks/useStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const FirebaseExample = () => {
  const { user, loading: authLoading, signIn, signUp, signOut, signInWithGoogle } = useAuth();
  const { addDocument } = useFirestore('reservations');
  const { data: reservations, loading: reservationsLoading } = useCollection('reservations');
  const { progress, uploadFile } = useStorage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      alert('Login realizado com sucesso!');
    } catch (error: any) {
      alert('Erro no login: ' + error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp(email, password, name);
      alert('Cadastro realizado com sucesso!');
    } catch (error: any) {
      alert('Erro no cadastro: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      alert('Login com Google realizado!');
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
  };

  const handleAddReservation = async () => {
    if (!name) {
      alert('Preencha o nome');
      return;
    }

    try {
      await addDocument({
        name,
        email: user?.email || '',
        date: new Date().toISOString(),
        status: 'pending',
      });
      alert('Reserva criada com sucesso!');
      setName('');
    } catch (error: any) {
      alert('Erro ao criar reserva: ' + error.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const path = `uploads/${Date.now()}_${file.name}`;
    uploadFile(file, path, (downloadURL) => {
      alert('Upload concluído! URL: ' + downloadURL);
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Firebase - Exemplo de Uso</h1>

      {/* Autenticação */}
      <Card>
        <CardHeader>
          <CardTitle>🔐 Autenticação</CardTitle>
          <CardDescription>
            {user ? `Bem-vindo, ${user.displayName || user.email}!` : 'Faça login para continuar'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <>
              <Input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleLogin}>Entrar</Button>
                <Button onClick={handleSignUp} variant="outline">
                  Cadastrar
                </Button>
                <Button onClick={handleGoogleLogin} variant="secondary">
                  Google
                </Button>
              </div>
            </>
          ) : (
            <div>
              <p className="mb-4">Email: {user.email}</p>
              <Button onClick={signOut} variant="destructive">
                Sair
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Firestore */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>🗄️ Firestore - Reservas</CardTitle>
            <CardDescription>Adicionar e visualizar reservas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nome da reserva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button onClick={handleAddReservation}>Adicionar Reserva</Button>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Reservas existentes:</h3>
              {reservationsLoading ? (
                <p>Carregando...</p>
              ) : reservations.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
              ) : (
                <ul className="space-y-2">
                  {reservations.map((reservation) => (
                    <li key={reservation.id} className="p-2 border rounded">
                      <strong>{reservation.name}</strong> - {reservation.status}
                      <br />
                      <small className="text-muted-foreground">
                        {new Date(reservation.date).toLocaleString('pt-BR')}
                      </small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>📁 Storage - Upload de Arquivos</CardTitle>
            <CardDescription>Fazer upload de imagens e arquivos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="file" onChange={handleFileUpload} accept="image/*" />
            {progress > 0 && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Progresso: {progress.toFixed(0)}%</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

