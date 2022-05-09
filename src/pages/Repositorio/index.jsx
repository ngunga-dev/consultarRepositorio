import { useEffect,useState } from "react";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";
import { Container, Owner, Loading, BackButton } from "./styles";

const Repositorio=({match})=>{
    const [repositories,setRepositories]=useState({})
    const [issues,setIssues]=useState([])
    const [loading,setLoading]=useState(true)

    useEffect(()=>{

        async function loadRepositorio(){
            const nameRepo = decodeURIComponent(match.params.repositorio);

           const [repositorioData,IssuesData]= await Promise.all([
                api.get(`/repos/${nameRepo}`),
                api.get(`/repos/${nameRepo}/issues`,{
                    params:{
                        state:"open",
                        per_page:5
                    }
                })
            ]);

           setRepositories(repositorioData.data)
           setIssues(IssuesData.data)
           setLoading(false)

           
        }

        loadRepositorio();

    },[match.params.repositorio]);

    
    if(loading){
        return(
            <Loading>
                <h1>Loading...</h1>
            </Loading>
        )
    }

    return(
        <>
            
             <Container>
                    <BackButton to="/">
                        <FaArrowLeft size={30} color="#000"/>
                    </BackButton>
                    <Owner>

                        <img 
                        src={repositories.owner.avatar_url}
                        alt={repositories.owner.login}
                         />

                         <h1>
                                {repositories.name}
                         </h1>
                         <p>
                                {repositories.description}
                         </p>
                    </Owner>
             </Container>
           
        </>
    )
}
export default Repositorio;