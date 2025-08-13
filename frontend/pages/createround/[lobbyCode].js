// page dynamique qui est créé en fonction de chaque code de lobby

import { useRouter } from 'next/router';
import CreateRound from '../../components/CreateRound';

function CreateRoundPage() {
  const router = useRouter();
  const { lobbyCode } = router.query;


  if (!lobbyCode) return null;

  return <CreateRound lobbyCode={lobbyCode} />;
}

export default CreateRoundPage;
