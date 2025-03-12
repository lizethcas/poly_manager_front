import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';

export function useSearch() {
  const searchTerm = ref('');

  const searchApi = async (term: string) => {
    console.log('Searching for:', term);
    if (!term) return [];
    const { get, apiRoutes } = await import('~/services/routes.api');
    const response = await get(apiRoutes.search(term));
    console.log('Search API response:', response);

    // Crear una nueva nota en memoria
    const newNote = {
      id: 2,
      student: 1,
      class_id: 1,
      title: "Note about English Grammar",
      content: "English grammar is the set of structural rules of the English language.",
      note_type: "general",
      tags: ["english", "grammar"],
      highlighted: false,
      color: "#33FF57",
      related_url: "http://example.com/english-grammar",
      related_content: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Verificar si el objeto de notas existe, si no, crearlo
    if (!response.data.notas) {
      response.data.notas = [];
    }

    // Añadir la nueva nota al arreglo existente
    response.data.notas.push(newNote);

    // Crear un nuevo escenario en memoria
    const newScenario = {
      id: 2,
      class_id: 1,
      cover: "https://s3-alpha-sig.figma.com/img/6f9b/4774/8a1347a33aab910106378d8208c38390?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Bk1i4g77nnVwYJBovSosEzhu-Pt2q3OXAX1hbw2kHYfTaxJSPTYSeieT346HBYSFxD-eUWxPNB6ggrDaiNctJAIqg5HgqBVJ-jzLwk~tycmGQan9YUJVpezlEACeEBAmxAjsPLLv95tSo7kIWS7C2Kxp7LFz3y02zElDLacvQoD644Tn9dxCUbQLT-se7VTHIohixXBblnC4g1uDV8X6qtv7vyOT~qPaMXeX7FaebKIHO9Ptgth1CSEGaRs~eiWOFUQ3KKmWXiJH3ShtwQELkLjuEstICAPGD8IH9AZQV8eQRYDrPWhrdBwV0~IZQZIgoaPxkpg~yFWfTVtU7tcKPg__",
      name: "Escenario de Introducción",
      description: "Practice a conversation with someone you meet for the first time",
      goals: "Objetivos del escenario",
      objectives: "Objetivos específicos",
      student_information: "Información del estudiante",
      role_polly: "Rol de Polly",
      role_student: "Rol del estudiante",
      conversation_starter: "Iniciador de conversación",
      vocabulary: "Vocabulario relevante",
      key_expressions: "Expresiones clave",
      end_conversation: "Fin de la conversación",
      end_conversation_saying: "Frase de cierre",
      feedback: "Retroalimentación",
      scoring: "Puntuación",
      additional_info: "Información adicional",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Verificar si el objeto de escenarios existe, si no, crearlo
    if (!response.data.escenarios) {
      response.data.escenarios = [];
    }

    // Añadir el nuevo escenario al arreglo existente
    response.data.escenarios.push(newScenario);

    return response.data;
  };

  const {
    data: searchResults,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => searchApi(searchTerm.value),
    enabled: computed(() => searchTerm.value.length > 2),
    staleTime: 300
  });

  const updateSearch = (term: string) => {
    searchTerm.value = term;
  };

  return {
    searchTerm,
    searchResults,
    isLoading,
    error,
    updateSearch,
    refetch
  };
}