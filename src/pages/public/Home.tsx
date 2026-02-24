import { useEffect, useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useSEO } from '../../utils/useSEO';
import { SecaoSlide } from '../../components/SecaoSlide';
import type { SlideItem } from '../../components/SecaoSlide';
import { SecaoNoticias } from '../../components/SecaoNoticias';
import type { NoticiaItem } from '../../components/SecaoNoticias';
import { SecaoProjetos } from '../../components/SecaoProjetos';
import { SecaoInstituicoes } from '../../components/SecaoInstituicoes';
import type { InstituicaoItem } from '../../components/SecaoInstituicoes';
import { noticiasService } from '../../services/noticiasService';
import { handleApiError } from '../../utils/errorHandler';
import { LoadingScreen } from '../../components/LoadingScreen';
import { formatarDataBrasileira } from '../../utils/dateUtils';
import SectiPredio from "../../assets/SECTIPredio.jpg";
import ArcoEC from "../../assets/ArcoEC.jpg";
import EntradaParqtel from "../../assets/EntradaParqtel.jpg";
import ECBanner from "../../assets/ECBANNER.jpg";
import FacepeBanner from "../../assets/FACEPEBANNER.jpg";
import ITEPBanner from "../../assets/ITEPE.png";
import PARQTELBanner from "../../assets/PARQTELBANNER.jpg";
import PortoDigitalBanner from "../../assets/PD.png";
import UPEBanner from "../../assets/UPEBANNER.jpg";

const slides: SlideItem[] = [
  {
    id: 1,
    image: SectiPredio,
    title: 'Bem-vindo à SECTI',
    description: 'Secretaria de Ciência, Tecnologia e Inovação - promovendo conhecimento e inovação.',
    button: { text: 'Saiba mais', href: '/secti/a-secretaria' },
  },
  {
    id: 2,
    image: ArcoEC,
    title: 'Espaço Ciência',
    description: 'Museu, localizado entre as cidades de Olinda e Recife, em Pernambuco. São 120.000 m² de área para fruição, lazer e aprendizagem.',
    button: { text: 'Visitar site', href: 'https://www.espacociencia.pe.gov.br/' },
  },
  {
    id: 3,
    image: EntradaParqtel,
    title: 'Parqtel',
    description: 'Projetos que transformam ideias em soluções reais.',
    button: { text: 'Visitar site', href: 'https://www.espacociencia.pe.gov.br/' },
  },
];

// Instituições Vinculadas
const instituicoesVinculadas: InstituicaoItem[] = [
  {
    id: 1,
    nome: 'PARQTEL',
    logo: PARQTELBanner,
    url: 'https://parqtel.pe.gov.br/',
    descricao: 'PARQTEL'
  },
  {
    id: 2,
    nome: 'FACEPE',
    logo: FacepeBanner,
    url: 'https://www.facepe.br/',
    descricao: 'Fundação de Amparo à Ciência e Tecnologia do Estado de Pernambuco'
  },
  {
    id: 3,
    nome: 'Espaço Ciência',
    logo: ECBanner,
    url: 'https://www.espacociencia.pe.gov.br/',
    descricao: 'Espaço Ciência'
  },
  {
    id: 4,
    nome: 'UPE',
    logo: UPEBanner,
    url: 'https://www.upe.br/',
    descricao: 'UPE',
  },
];

// Instituições com Contrato de Gestão
const instituicoesContratoGestao: InstituicaoItem[] = [
  {
    id: 1,
    nome: 'Porto Digital',
    logo: PortoDigitalBanner,
    url: 'https://www.portodigital.org/',
    descricao: 'Parque Tecnológico de Pernambuco'
  },
  {
    id: 4,
    nome: 'ITEP',
    logo: ITEPBanner,
    url: 'https://www.itep.br/',
    descricao: 'Instituto de Tecnologia de Pernambuco'
  },
];



export const Home = () => {
  const [noticiaDestaque, setNoticiaDestaque] = useState<NoticiaItem | null>(null);
  const [noticias, setNoticias] = useState<NoticiaItem[]>([]);
  const [isLoadingNoticias, setIsLoadingNoticias] = useState(true);

  // SEO
  useSEO({
    title: 'Home',
    description: 'SECTI - Secretaria de Ciência, Tecnologia e Inovação de Pernambuco. Conheça nossas ações, editais, noticias e transparência.',
    canonical: 'https://secti.pe.gov.br/',
    keywords: 'SECTI, Pernambuco, Ciência, Tecnologia, Inovação, Governo',
  });

  useEffect(() => {
    const carregarNoticias = async () => {
      try {
        setIsLoadingNoticias(true);
        // Buscar notícias publicadas do endpoint público
        const response = await noticiasService.listarPublico({
          itensPorPagina: 10
        });

        if (response.itens.length > 0) {
          // Converter primeiro item para NoticiaItem (destaque)
          const primeiraNoticia = response.itens[0];
          setNoticiaDestaque({
            id: primeiraNoticia.id,
            slug: primeiraNoticia.slug,
            titulo: primeiraNoticia.titulo,
            categoria: 'Notícia',
            autor: primeiraNoticia.autor,
            data: formatarDataBrasileira(primeiraNoticia.dataPublicacao),
            resumo: primeiraNoticia.resumo,
            imagem: primeiraNoticia.imagemCapaUrl || SectiPredio,
            link: `/noticias/${primeiraNoticia.slug}`,
            tags: primeiraNoticia.tags,
          });

          // Converter restante em NoticiaItem para a lista
          const noticiasList = response.itens.slice(1, 4).map(noticia => ({
            id: noticia.id,
            slug: noticia.slug,
            titulo: noticia.titulo,
            categoria: 'Notícia',
            data: formatarDataBrasileira(noticia.dataPublicacao),
            imagem: noticia.imagemCapaUrl || SectiPredio,
            link: `/noticias/${noticia.slug}`,
            tags: noticia.tags,
          }));

          setNoticias(noticiasList);
        }
      } catch (error) {
        console.error('Erro ao carregar notícias:', handleApiError(error));
        // Manter notícias em branco em caso de erro
      } finally {
        setIsLoadingNoticias(false);
      }
    };

    carregarNoticias();
  }, []);

  // Notícia destaque padrão em caso de erro
  const defaultNoticiaDestaque: NoticiaItem = {
    id: 0,
    slug: 'padrao',
    titulo: 'Bem-vindo à SECTI',
    categoria: 'Notícia',
    autor: 'Redação SECTI',
    data: formatarDataBrasileira(new Date()),
    resumo: 'Acompanhe as últimas notícias sobre inovação e tecnologia em Pernambuco.',
    imagem: SectiPredio,
    link: '#',
  };

  return (
      <>
        {isLoadingNoticias && <LoadingScreen />}
        <PublicLayout>
          <SecaoSlide slides={slides} autoplay interval={7000} />

          {!isLoadingNoticias && (
            <>
              <SecaoNoticias
                noticiaDestaque={noticiaDestaque || defaultNoticiaDestaque}
                noticias={noticias}
              />
              <SecaoProjetos />
              <SecaoInstituicoes
                  instituicoesVinculadas={instituicoesVinculadas}
                  instituicoesContratoGestao={instituicoesContratoGestao}
              />
            </>
          )}
        </PublicLayout>
      </>
  );
};
