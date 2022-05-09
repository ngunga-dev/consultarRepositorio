
import {FaGithub,FaPlus,FaSpinner,FaBars,FaTrash} from "react-icons/fa"
import { Container, Form, SubmitButton, List, DeleteButton } from "./styled";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { useEffect,useState,useCallback} from "react";

const Main = () => {

  const [newRepo,setNewRepo]=useState("")
  const [repositories,setRepositories]=useState([])
  const [loading,setLoading]=useState(false)

  const [inputError,setInputError]=useState(null)


  // Buscar
    useEffect(()=>{
      const repoStorage=localStorage.getItem("repos")
      if(repoStorage){
        setRepositories(JSON.parse(repoStorage))
      }
    },[])

  // Salvar 
  
  useEffect(()=>{
    localStorage.setItem("repos",JSON.stringify(repositories))
  },[repositories])


  // useEffect(()=>{
    
  // },[newRepo])

 const hendleSubmit=useCallback((e)=>{

  e.preventDefault();

  async function submit(){
    setLoading(true)
    setInputError(null)

    try{
      if(newRepo === ""){
        throw new Error("Digite um repositório")
      }

      const response = await api.get(`/repos/${newRepo}`);
      
      const hasRepo=repositories.find(repo=>repo.name === newRepo)
      if(hasRepo){
        throw new Error("Repositório já existe")
      }

      const data = {
        name: response.data.full_name,
      };
      

      setRepositories([...repositories, data]);
      setNewRepo("");
    }catch(error){
      setInputError(true)
      console.log(error)
    }finally{
      setLoading(false)
    }

  }

  submit()

 },[newRepo,repositories]) 

  function handleInputChange(e){
    setNewRepo(e.target.value)
    setInputError(null)
  }


  const handleDelete=useCallback((repo)=>{  //repo é o valor do array que está sendo removido
    const find=repositories.filter(r=>r.name!==repo)
    setRepositories(find)
  },[repositories])

  return (
    <>
      <Container>
        <h1>
          <FaGithub size={25} />
          Meus Repositorios
        </h1>

        <Form onSubmit={hendleSubmit} error={inputError}>
          <input
            value={newRepo}
            onChange={handleInputChange}
            type="text"
            placeholder="Digite o nome do repositório"
          />

          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((repo, index) => (
            <li key={index}>
              <span>
                <DeleteButton onClick={() => handleDelete(repo.name)}>
                  <FaTrash size={14} />
                </DeleteButton>
                {repo.name}
              </span>
              <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                <FaBars size={20} />
              </Link>
            </li>
          ))}
        </List>
      </Container>
    </>
  );
};
export default Main;
