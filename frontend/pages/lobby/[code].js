// page dynamique qui est créé en fonction de chaque code de lobby

import { useRouter } from 'next/router';
import Lobby from '../../components/lobby';

function LobbyPage() {
  const router = useRouter();
  const { code } = router.query;


  if (!code) return null;

  return <Lobby lobbyCode={code} />;
}

export default LobbyPage;
