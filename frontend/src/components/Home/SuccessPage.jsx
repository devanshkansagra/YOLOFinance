import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function SuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("sessionId");
  const navigate = useNavigate();
  useEffect(() => {
    async function saveDetails() {
        try {
            const response = await fetch('http://localhost:4000/api/investments/confirm', {
                method: "POST",
                headers: {
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
