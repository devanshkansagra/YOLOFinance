import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function SuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("sessionId");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    async function saveDetails() {
        try {
            const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN+'/api/investments/confirm', {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({sessionId: sessionId}),
                credentials: "include"
            })
            if(response.ok) {
                navigate('/Dashboard');
            }

            else {
                navigate('/login');
            }
        }
        catch(error) {
            console.log(error);
        }
    }
    saveDetails();
  }, []);
  return <></>;
}

export default SuccessPage;
