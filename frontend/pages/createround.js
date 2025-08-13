// pages/creategamemulti.js

import CreateRound from "../components/CreateRound";
import { useRouter } from 'next/router';
import { useRouter } from 'next/router';

function CreateRoundPage() {

  const router = useRouter();
  const { lobbyCode } = router.query;

  return (
    <>
      <CreateRound lobbyCode={lobbyCode}  />
    </>
  );
}

export default CreateRoundPage;
