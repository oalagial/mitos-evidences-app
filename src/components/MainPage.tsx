import { useQuery } from "react-query";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import EvidencesTable from "./ServicesTable";

interface ParametersType {
  name: string;
  // tvShows: string;
}

const MainPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  const [parameters, setParameters] = useState<ParametersType>({
    name: "",
    // tvShows: "",
  });

  const {
    isLoading,
    error,
    data: evidences,
    refetch,
  } = useQuery(
    ["services", { page, pageSize, name: parameters.name }],
    () => {
      //let url = `https://api.digigov.grnet.gr/v1/services?page=${page}&limit=${pageSize}`;
      let url = `http://localhost:3003/services?page=${page}&limit=${pageSize}`;

      if (parameters.name) {
        url = `http://localhost:3003/services/search/title/${parameters.name}`;
      }

      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ key1: "value1", key2: "value2" }), // set your body params here
      }).then((res) => {
        return res.json();
      });
    },
    {
      //This flag tells React Query to keep and display previous data while refetching in the background,
      // which reduces perceived latency and prevents UI flickers.
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    refetch();
  }, [parameters]);

  const handleSearchButtonClicked = (parameters: ParametersType) => {
    setParameters(parameters);
  };

  const handlePageChanged = (page: number) => {
    setPage(page);
  };

  const handlePageSizeChanged = (pageSize: number) => {
    setPageSize(pageSize);
  };

  if (isLoading) return <div>'Loading...'</div>;

  // if (error) return <div>'An error has occurred: ' + error.message</div>;
  return (
    <Box sx={{ margin: 4 }}>
      <SearchBar handleSearchButtonClicked={handleSearchButtonClicked} />
      <EvidencesTable
        evidences={evidences}
        page={page}
        pageSize={pageSize}
        handlePageChanged={handlePageChanged}
        handlePageSizeChanged={handlePageSizeChanged}
      />
    </Box>
  );
};

export default MainPage;
