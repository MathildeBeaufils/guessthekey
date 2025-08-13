// page dynamique qui est créé en fonction de chaque code de lobby

import { useRouter } from 'next/router';
import Game from '../../components/Game';

function GamePage() {
  const router = useRouter();
  const { code } = router.query;


  if (!code) return <div>Redirection vers la création de manche ...</div>;

  return <Game lobbyCode={code} />;
}

export default GamePage;
