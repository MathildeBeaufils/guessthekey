// pages/creategamemulti.js

import CreateRound from "../components/CreateRound";
import { useRouter } from 'next/router';

function CreateRoundPage() {
    const router = useRouter();
    const { lobbyCode } = router.query;
    const { username } = router.query;
  return (
    <>
      <CreateRound lobbyCode={lobbyCode} username={username} />
    </>
  );
}

export default CreateRoundPage;
