import useSWR from "swr";

const fetchAPI = async (key) => {
  const response = await fetch(key);

  const responseBody = await response.json();

  return responseBody;
};

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <>
      <h2>Status</h2>
      <UpdatedAt isLoading={isLoading} updatedAt={data?.updated_at} />
      <DatabaseStatus data={data} />
    </>
  );
}

function  UpdatedAt({ isLoading, updatedAt }) {
  const formattedDate = new Date(updatedAt).toLocaleString("pt-BR");

  return (
    <div>
      <p>Última atualização: {isLoading ? "Carregando..." : formattedDate} </p>
    </div>
  );
}

function DatabaseStatus({ isLoading, data }) {
  const database = data?.dependencies?.database;

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data && database) {
    databaseStatusInformation = (
      <>
        <div>
          <p>Versão: {database.version}</p>
        </div>

        <div>
          <p>Conexões abertas: {database.opened_connections}</p>
        </div>

        <div>
          <p>Conexões máximas: {database.max_connections}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      <div>{databaseStatusInformation}</div>
    </>
  );
}
