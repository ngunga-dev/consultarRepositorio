import { useEffect, useState } from "react";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FillterLists,
} from "./styles";

const Repositorio = ({ match }) => {
  const [repositories, setRepositories] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([
      {state:"all",label:"Todos", active:true},
      {state:"open",label:"Abertas", active:false},
      {state:"closed",label:"Fechado", active:false},
    ]);

    const [fillterIndex,setFillterIndex]=useState(0)

  useEffect(() => {
    async function loadRepositorio() {
      const nameRepo = decodeURIComponent(match.params.repositorio);

      const [repositorioData, IssuesData] = await Promise.all([
        api.get(`/repos/${nameRepo}`),
        api.get(`/repos/${nameRepo}/issues`, {
          params: {
            state: "open",
            per_page: 5,
          },
        }),
      ]);

      setRepositories(repositorioData.data);
      setIssues(IssuesData.data);
      setLoading(false);
    }

    loadRepositorio();
  }, [match.params.repositorio]);


  useEffect(() => {
    async function loadIssues() {
        const nameRepo = decodeURIComponent(match.params.repositorio);

        const response = await api.get(`/repos/${nameRepo}/issues`, {
            params: {
                state: filter[fillterIndex].state,
                page,
                per_page: 5,
            }
        })

        setIssues(response.data);
    }
    loadIssues();
  },[fillterIndex,filter,match.params.repositorio,page]);

  function hendlePage(action){
    setPage(action === 'back' ? page - 1 : page + 1);

  }

  function handleFilter(index){
    setFillterIndex(index)

  }

  if (loading) {
    return (
      <Loading>
        <h1>Loading...</h1>
      </Loading>
    );
  }

  return (
    <>
      <Container>
        <BackButton to="/">
          <FaArrowLeft size={30} color="#000" />
        </BackButton>
        <Owner>
          <img
            src={repositories.owner.avatar_url}
            alt={repositories.owner.login}
          />

          <h1>{repositories.name}</h1>
          <p>{repositories.description}</p>
        </Owner>

        <FillterLists
        active={fillterIndex}
        >
        {
            filter.map((item, index) => (
                <button 
                type="button"
                key={item.label}
                onClick={()=>handleFilter(index)}
                >
                    {item.label}
                </button>
            ))
        }
        </FillterLists>

        <IssuesList>
          {issues.map((issue, index) => (
            <li key={index}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map((label, index) => (
                    <span key={index}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>

        <PageActions>
          <button 
          type="button" 
          onClick={() => hendlePage("back")}
          disabled={page <2}
          >
            Voltar
          </button>

          <button type="button" onClick={() => hendlePage("next")}>
            Proxíma
          </button>
        </PageActions>
      </Container>
    </>
  );
};
export default Repositorio;
