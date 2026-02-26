import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from "./contexts";
import { PrivateRoute } from './guards/PrivateRoute';
import { PrivateRouteWithMenuAccess } from './guards/PrivateRouteWithMenuAccess';
import { PublicRoute } from './guards/PublicRoute';
import CookieConsentBanner from './components/CookieConsentBanner';

// Public Pages
import { Home } from './pages/public/Home.tsx';
import { Login } from './pages/public/Login.tsx';
import { RecuperarSenha } from './pages/public/RecuperarSenha.tsx';
import { ResetarSenha } from './pages/public/ResetarSenha.tsx';
import { Erro404 } from './pages/public/Erro404.tsx';
import { TodasNoticias } from './pages/public/TodasNoticias.tsx';
import { VisualizarNoticia } from './pages/public/VisualizarNoticia.tsx';
import { Editais } from './pages/public/Editais.tsx';
import { ASecretaria } from './pages/public/secti/ASecretaria.tsx';
import { ASecretariaCargo } from './pages/public/secti/ASecretariaCargo.tsx';
import { Historia } from './pages/public/secti/Historia.tsx';
import { Documentos } from './pages/public/secti/Documentos.tsx';
import { Organograma } from './pages/public/secti/Organograma.tsx';
import { Certificacoes } from './pages/public/secti/Certificacoes.tsx';
import { Servidor } from './pages/public/secti/Servidor.tsx';
import { Parcerias } from './pages/public/secti/Parcerias.tsx';
import { Legislacao } from './pages/public/secti/Legislacao.tsx';
import { Relatorios } from './pages/public/secti/Relatorios.tsx';
import { Projetos } from './pages/public/Projetos.tsx';
import { PoliticaPrivacidade } from './pages/public/PoliticaPrivacidade.tsx';

// Private Pages
import { DashboardPage } from './pages/private/DashboardPage';
import { SettingsPage } from './pages/private/SettingsPage';
 import { ListaNoticias } from './pages/private/noticias/ListaNoticias.tsx';
import { CriarNoticia } from './pages/private/noticias/CriarNoticia.tsx';
import { EditarNoticia } from './pages/private/noticias/EditarNoticia.tsx';
import { VisualizarNoticiaAdmin } from './pages/private/noticias/VisualizarNoticia.tsx';
import { ListarEdital } from './pages/private/editais/ListarEdital.tsx';
import { CriarEdital } from './pages/private/editais/CriarEdital.tsx';
import { ListarAvisosDeIntencao } from './pages/private/avisosdeintencao/ListarAvisosDeIntencao.tsx';
import { CriarAvisosDeIntencao } from './pages/private/avisosdeintencao/CriarAvisosDeIntencao.tsx';
import { ListarDocumentos } from './pages/private/documentos/ListarDocumentos.tsx';
import { CriarDocumentos } from './pages/private/documentos/CriarDocumentos.tsx';
import { ListarDocumentosServidor } from './pages/private/documentosservidor/ListarDocumentosServidor.tsx';
import { CriarDocumentosServidor } from './pages/private/documentosservidor/CriarDocumentosServidor.tsx';
import { ListarLegislacao } from './pages/private/legislacao/ListarLegislacao.tsx';
import { CriarLegislacao } from './pages/private/legislacao/CriarLegislacao.tsx';
import { ListarParcerias } from './pages/private/parcerias/ListarParcerias.tsx';
import { CriarParcerias } from './pages/private/parcerias/CriarParcerias.tsx';
import { ListarTransparencia } from './pages/private/transparencia/ListarTransparencia.tsx';
import { CriarTransparencia } from './pages/private/transparencia/CriarTransparencia.tsx';
import { EditarTransparencia } from './pages/private/transparencia/EditarTransparencia.tsx';
import { ListarProcessos } from './pages/private/processos/ListarProcessos.tsx';
import { CriarProcessos } from './pages/private/processos/CriarProcessos.tsx';
import { ListarRelatorios } from './pages/private/relatorios/ListarRelatorios.tsx';
import { CriarRelatorios } from './pages/private/relatorios/CriarRelatorios.tsx';
import {ApresentacaoOuvidoria} from "./pages/public/ouvidoria/ApresentacaoOuvidoria.tsx";
import {FaleComOuvidoria} from "./pages/public/ouvidoria/FaleComOuvidoria.tsx";
import {RedeOuvidorias} from "./pages/public/ouvidoria/RedeOuvidorias.tsx";
import {PerguntasFrequentes} from "./pages/public/transparencia/PerguntasFrequentes.tsx";
import {InformacoesInstitucionais} from "./pages/public/transparencia/InformacoesInstitucionais.tsx";
import { Transparencia } from './pages/public/secti/Transparencia.tsx';
import {ListarUsuarios} from "./pages/private/usuarios/ListarUsuarios.tsx";
import {CriarUsuarios} from "./pages/private/usuarios/CriarUsuarios.tsx";
import {EditarUsuarios} from "./pages/private/usuarios/EditarUsuarios.tsx";
import {ListarCategorias} from "./pages/private/categorias/ListarCategorias.tsx";
import {CriarCategorias} from "./pages/private/categorias/CriarCategorias.tsx";
import {EditarCategorias} from "./pages/private/categorias/EditarCategorias.tsx";
import {ListarPerfil} from "./pages/private/perfis/ListarPerfil.tsx";
import {CriarPerfil} from "./pages/private/perfis/CriarPerfil.tsx";
import {EditarPerfil} from "./pages/private/perfis/EditarPerfil.tsx";
import { ListaProjetos } from './pages/private/projetos/ListaProjetos.tsx';
import { CriarProjeto } from './pages/private/projetos/CriarProjeto.tsx';
import { EditarProjeto } from './pages/private/projetos/EditarProjeto.tsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CookieConsentBanner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<TodasNoticias />} />
          <Route path="/noticias/:slug" element={<VisualizarNoticia />} />
          <Route path="/editais" element={<Editais />} />
          <Route path="/projetos/:slug" element={<Projetos/>}/>
          <Route path="/projetos/" element={<Projetos />} />
          <Route path="/secti/a-secretaria" element={<ASecretaria />} />
          <Route path="/secti/a-secretaria-cargo" element={<ASecretariaCargo />} />
          <Route path="/secti/historia" element={<Historia />} />
          <Route path="/secti/documentos" element={<Documentos />} />
          <Route path="/secti/organograma" element={<Organograma />} />
          <Route path="/secti/certificacoes" element={<Certificacoes />} />
          <Route path="/secti/servidor" element={<Servidor />} />
          <Route path="/secti/legislacao" element={<Legislacao/>}/>
          <Route path="/secti/parcerias" element={<Parcerias />} />
          <Route path="/secti/relatorios" element={<Relatorios />} />
          <Route path="/ouvidoria/apresentacao" element={<ApresentacaoOuvidoria/>}/>
          <Route path="/ouvidoria/fale-com-ouvidoria" element={<FaleComOuvidoria/>}/>
          <Route path="/ouvidoria/rede-ouvidorias" element={<RedeOuvidorias/>}/>
          <Route path="/transparencia" element={<Transparencia/>}/>
          <Route path="/transparencia/perguntas-frequentes" element={<PerguntasFrequentes/>}/>
          <Route path="/transparencia/informacoes-institucionais" element={<InformacoesInstitucionais/>}/>
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade/>} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/recuperar-senha"
            element={
              <PublicRoute>
                <RecuperarSenha />
              </PublicRoute>
            }
          />
          <Route
            path="/resetar-senha"
            element={
              <PublicRoute>
                <ResetarSenha />
              </PublicRoute>
            }
          />

          {/* Private Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />

          {/* Notícias - Admin */}
          <Route
            path="/admin/noticias"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Noticias">
                <ListaNoticias />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/noticias/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Noticias">
                <CriarNoticia />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/noticias/editar/:slug"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Noticias">
                <EditarNoticia />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/noticias/visualizar/:slug"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Noticias">
                <VisualizarNoticiaAdmin />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Editais - Admin */}
          <Route
            path="/admin/editais"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Editais">
                <ListarEdital />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/editais/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Editais">
                <CriarEdital />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Avisos de Intenção - Admin */}
          <Route
            path="/admin/avisosdeintencao"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Aviso_de_Intencao_de_Contratar">
                <ListarAvisosDeIntencao />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/avisosdeintencao/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Aviso_de_Intencao_de_Contratar">
                <CriarAvisosDeIntencao />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Documentos - Admin */}
          <Route
            path="/admin/documentos"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Documentos">
                <ListarDocumentos />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/documentos/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Documentos">
                <CriarDocumentos />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/documentos-servidor"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Documentos_do_Servidor">
                <ListarDocumentosServidor />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/documentos-servidor/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Documentos_do_Servidor">
                <CriarDocumentosServidor />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Legislacao - Admin */}
          <Route
            path="/admin/legislacao"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Legislacao">
                <ListarLegislacao />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/legislacao/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Legislacao">
                <CriarLegislacao />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Parcerias - Admin */}
          <Route
            path="/admin/parcerias"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Parcerias">
                <ListarParcerias />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/parcerias/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Parcerias">
                <CriarParcerias />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Projetos - Admin */}
          <Route
            path="/admin/projetos"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Projetos">
                <ListaProjetos />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/projetos/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Projetos">
                <CriarProjeto />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/projetos/editar/:id"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Projetos">
                <EditarProjeto />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Transparencia - Admin */}
          <Route
            path="/admin/transparencia"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Transparencia">
                <ListarTransparencia />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/transparencia/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Transparencia">
                <CriarTransparencia />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/transparencia/editar/:id"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Transparencia">
                <EditarTransparencia />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Processos - Admin */}
          <Route
            path="/admin/processos"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Processos">
                <ListarProcessos />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/processos/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Processos">
                <CriarProcessos />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Relatórios - Admin */}
          <Route
            path="/admin/relatorios"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Relatorios">
                <ListarRelatorios />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/relatorios/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Relatorios">
                <CriarRelatorios />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* Usuários - Admin */}
          <Route
            path="/admin/usuarios"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Usuarios">
                <ListarUsuarios/>
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/usuarios/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Usuarios">
                <CriarUsuarios/>
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/usuarios/editar/:id"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Usuarios">
                <EditarUsuarios/>
              </PrivateRouteWithMenuAccess>
            }
          />
          {/* Categorias - Admin */}
          <Route
            path="/admin/categorias"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Categorias">
                <ListarCategorias />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/categorias/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Categorias">
                <CriarCategorias />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/categorias/editar/:id"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Categorias">
                <EditarCategorias />
              </PrivateRouteWithMenuAccess>
            }
          />
          {/* Perfis - Admin */}
          <Route
            path="/admin/perfis"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Perfis">
                <ListarPerfil />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/perfis/criar"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Perfis">
                <CriarPerfil />
              </PrivateRouteWithMenuAccess>
            }
          />
          <Route
            path="/admin/perfis/editar/:id"
            element={
              <PrivateRouteWithMenuAccess requiredMenu="Perfis">
                <EditarPerfil />
              </PrivateRouteWithMenuAccess>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<Erro404 />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
