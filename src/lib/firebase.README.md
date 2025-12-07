# Firebase - Guia de Uso

## 📦 Estrutura

O Firebase foi configurado no projeto com os seguintes arquivos:

- **`src/lib/firebase.ts`** - Configuração principal do Firebase
- **`src/hooks/useAuth.ts`** - Hook para autenticação de usuários
- **`src/hooks/useFirestore.ts`** - Hooks para operações no Firestore
- **`src/hooks/useStorage.ts`** - Hook para upload de arquivos

## 🔐 Autenticação (`useAuth`)

### Exemplo de uso:

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { user, loading, signIn, signUp, signOut, signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn('email@example.com', 'senha123');
      console.log('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      console.log('Login com Google realizado!');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Bem-vindo, {user.displayName}!</p>
          <button onClick={signOut}>Sair</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Entrar</button>
          <button onClick={handleGoogleLogin}>Entrar com Google</button>
        </div>
      )}
    </div>
  );
}
```

## 🗄️ Firestore (`useFirestore` / `useCollection`)

### Buscar documentos em tempo real:

```typescript
import { useCollection } from '@/hooks/useFirestore';
import { where, orderBy } from 'firebase/firestore';

function ReservationsComponent() {
  const { data: reservations, loading } = useCollection('reservations', [
    orderBy('createdAt', 'desc'),
    where('status', '==', 'confirmed')
  ]);

  if (loading) return <div>Carregando...</div>;

  return (
    <ul>
      {reservations.map(reservation => (
        <li key={reservation.id}>{reservation.name}</li>
      ))}
    </ul>
  );
}
```

### Adicionar/Atualizar/Deletar documentos:

```typescript
import { useFirestore } from '@/hooks/useFirestore';

function BookingForm() {
  const { addDocument, updateDocument, deleteDocument } = useFirestore('reservations');

  const handleSubmit = async (formData) => {
    try {
      const docId = await addDocument({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        status: 'pending'
      });
      console.log('Reserva criada:', docId);
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
    }
  };

  const handleUpdate = async (reservationId, newData) => {
    try {
      await updateDocument(reservationId, newData);
      console.log('Reserva atualizada!');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const handleDelete = async (reservationId) => {
    try {
      await deleteDocument(reservationId);
      console.log('Reserva deletada!');
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

## 📁 Storage (`useStorage`)

### Upload de imagens/arquivos:

```typescript
import { useStorage } from '@/hooks/useStorage';

function ImageUpload() {
  const { progress, uploadFile, uploadFileSimple } = useStorage();

  const handleFileUpload = (file: File) => {
    const path = `images/${Date.now()}_${file.name}`;
    
    uploadFile(file, path, (downloadURL) => {
      console.log('Upload concluído! URL:', downloadURL);
      // Salvar a URL no Firestore, por exemplo
    });
  };

  // Upload simples sem monitorar progresso
  const handleSimpleUpload = async (file: File) => {
    try {
      const url = await uploadFileSimple(file, `documents/${file.name}`);
      console.log('Arquivo enviado:', url);
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
      }} />
      {progress > 0 && <p>Progresso: {progress.toFixed(0)}%</p>}
    </div>
  );
}
```

## 🔥 Uso direto do Firebase

Se preferir usar diretamente os serviços sem hooks:

```typescript
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

// Exemplo: Adicionar documento diretamente
const addReservation = async () => {
  const docRef = await addDoc(collection(db, 'reservations'), {
    name: 'João Silva',
    date: new Date()
  });
  console.log('ID do documento:', docRef.id);
};
```

## 🚀 Próximos Passos

1. Configure as regras de segurança no Firebase Console
2. Ative os métodos de autenticação desejados (Email/Password, Google, etc.)
3. Crie as coleções no Firestore conforme necessário
4. Configure o Storage para aceitar uploads

## 📚 Recursos

- [Documentação do Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)

