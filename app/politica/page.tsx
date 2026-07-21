import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, Mail, MapPin, Phone, ShieldCheck } from "lucide-react"

import { client } from "@/sanity/lib/client"
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import type { SiteSettings } from "@/types/sanity"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Política de Privacidade | Marcelo Victor Imóveis",
  description:
    "Saiba como Marcelo Victor Imóveis coleta, utiliza, compartilha e protege dados pessoais, inclusive em formulários do site e anúncios da Meta.",
  alternates: { canonical: "/politica" },
  robots: { index: true, follow: true },
}

async function getSiteSettings() {
  try {
    return await client.fetch<SiteSettings>(SITE_SETTINGS_QUERY)
  } catch (error) {
    console.error("Error fetching site settings on privacy page:", error)
    return null
  }
}

const sectionClassName = "scroll-mt-28 space-y-4"
const headingClassName = "text-2xl font-bold tracking-tight text-slate-900"
const paragraphClassName = "leading-7 text-slate-600"
const listClassName = "list-disc space-y-2 pl-6 leading-7 text-slate-600 marker:text-brand-primary"

export default async function PrivacyPolicyPage() {
  const siteSettings = await getSiteSettings()
  const controllerName = siteSettings?.brokerName || siteSettings?.title || "Marcelo Victor Imóveis"
  const contactEmail = siteSettings?.email || "marcelovictorimoveis@gmail.com"

  return (
    <div className="bg-slate-50">
      <section className="border-b bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-16 text-white sm:py-20">
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Privacidade e proteção de dados
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Este documento explica de forma clara como tratamos dados pessoais no site, no atendimento
            imobiliário e em campanhas realizadas no Facebook e no Instagram.
          </p>
          <p className="mt-6 text-sm text-slate-400">
            Vigente desde 21 de julho de 2026 • Última atualização: 21 de julho de 2026
          </p>
        </div>
      </section>

      <div className="container max-w-5xl py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav aria-label="Nesta política" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-bold text-slate-900">Nesta política</p>
              <ol className="mt-4 space-y-2 text-sm text-slate-600">
                <li><a className="hover:text-brand-primary" href="#responsavel">1. Responsável</a></li>
                <li><a className="hover:text-brand-primary" href="#dados">2. Dados coletados</a></li>
                <li><a className="hover:text-brand-primary" href="#finalidades">3. Como usamos</a></li>
                <li><a className="hover:text-brand-primary" href="#meta">4. Meta Lead Ads</a></li>
                <li><a className="hover:text-brand-primary" href="#compartilhamento">5. Compartilhamento</a></li>
                <li><a className="hover:text-brand-primary" href="#direitos">6. Seus direitos</a></li>
                <li><a className="hover:text-brand-primary" href="#contato-privacidade">7. Contato</a></li>
              </ol>
            </nav>
          </aside>

          <article className="space-y-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <section className={sectionClassName} aria-labelledby="introducao-titulo">
              <h2 id="introducao-titulo" className={headingClassName}>Sobre esta Política</h2>
              <p className={paragraphClassName}>
                Esta Política se aplica aos dados pessoais tratados por {controllerName} por meio do site
                marcelovictorimoveis.com.br, de seus formulários de contato, do atendimento por WhatsApp,
                e-mail ou telefone e de campanhas e formulários de geração de cadastros veiculados pela Meta,
                incluindo Facebook e Instagram.
              </p>
              <p className={paragraphClassName}>
                O tratamento é realizado em conformidade com a Lei nº 13.709/2018, a Lei Geral de Proteção de
                Dados Pessoais (LGPD), e com as regras aplicáveis às ferramentas de geração de cadastros da Meta.
              </p>
            </section>

            <section id="responsavel" className={sectionClassName} aria-labelledby="responsavel-titulo">
              <h2 id="responsavel-titulo" className={headingClassName}>1. Quem é o responsável pelos dados</h2>
              <p className={paragraphClassName}>
                O controlador dos dados pessoais descritos nesta Política é <strong>{controllerName}</strong>,
                responsável por decidir como e por que esses dados serão utilizados no atendimento e na
                intermediação imobiliária.
              </p>
              <div className="grid gap-3 rounded-xl bg-slate-50 p-5 text-sm text-slate-700 sm:grid-cols-2">
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 hover:text-brand-primary">
                  <Mail className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                  <span className="break-all">{contactEmail}</span>
                </a>
                {siteSettings?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                    <span>{siteSettings.phone}</span>
                  </div>
                )}
                {siteSettings?.address && (
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                    <span>{siteSettings.address}</span>
                  </div>
                )}
              </div>
            </section>

            <section id="dados" className={sectionClassName} aria-labelledby="dados-titulo">
              <h2 id="dados-titulo" className={headingClassName}>2. Quais dados podemos coletar</h2>
              <ul className={listClassName}>
                <li><strong>Dados de identificação e contato:</strong> nome, e-mail e telefone ou WhatsApp.</li>
                <li><strong>Dados sobre o interesse imobiliário:</strong> imóvel consultado, localização, faixa de preço, preferências, mensagem e histórico de atendimento.</li>
                <li><strong>Dados fornecidos pela Meta:</strong> informações que você escolher enviar em um formulário do Facebook ou Instagram, conforme os campos e avisos exibidos na campanha.</li>
                <li><strong>Dados técnicos:</strong> endereço IP, data e hora de acesso, navegador, dispositivo, páginas visitadas e registros de segurança, quando gerados pela hospedagem e por tecnologias legítimas do site.</li>
                <li><strong>Dados de comunicação:</strong> conteúdo de conversas mantidas por e-mail, telefone ou WhatsApp.</li>
              </ul>
              <p className={paragraphClassName}>
                Não solicitamos intencionalmente dados pessoais sensíveis por formulários de anúncios ou de
                contato. Pedimos que você não envie informações sensíveis que não sejam necessárias ao atendimento.
              </p>
            </section>

            <section id="finalidades" className={sectionClassName} aria-labelledby="finalidades-titulo">
              <h2 id="finalidades-titulo" className={headingClassName}>3. Para que usamos os dados</h2>
              <ul className={listClassName}>
                <li>responder solicitações e prestar atendimento personalizado;</li>
                <li>apresentar imóveis compatíveis com o interesse informado e agendar visitas;</li>
                <li>realizar procedimentos preliminares a uma possível compra, venda ou locação;</li>
                <li>manter o histórico do relacionamento e dar continuidade ao atendimento;</li>
                <li>enviar comunicações comerciais relacionadas ao mercado imobiliário quando houver consentimento ou outra base legal aplicável, sempre com possibilidade de oposição ou descadastramento;</li>
                <li>medir o desempenho de campanhas, prevenir fraudes, proteger o site e cumprir obrigações legais ou regulatórias;</li>
                <li>exercer direitos em processos administrativos, judiciais ou arbitrais.</li>
              </ul>
              <p className={paragraphClassName}>
                Conforme o caso, utilizamos como bases legais a execução de procedimentos preliminares solicitados
                pelo titular, o legítimo interesse com avaliação dos direitos envolvidos, o consentimento, o
                cumprimento de obrigação legal ou regulatória e o exercício regular de direitos.
              </p>
            </section>

            <section id="meta" className={sectionClassName} aria-labelledby="meta-titulo">
              <h2 id="meta-titulo" className={headingClassName}>4. Facebook, Instagram e Meta Lead Ads</h2>
              <p className={paragraphClassName}>
                Quando você envia um formulário de cadastro em um anúncio do Facebook ou do Instagram, a Meta nos
                disponibiliza somente os dados que você decidiu informar. Usamos esses dados para cumprir a
                finalidade apresentada no anúncio, como entrar em contato, enviar informações sobre imóveis ou
                agendar atendimento.
              </p>
              <ul className={listClassName}>
                <li>não vendemos dados de geração de cadastros recebidos da Meta;</li>
                <li>não utilizamos esses dados para finalidade incompatível com o aviso do anúncio sem obter a autorização necessária;</li>
                <li>não direcionamos formulários de geração de cadastros a menores de 18 anos;</li>
                <li>limitamos o acesso aos dados a pessoas e prestadores que precisam deles para realizar o atendimento informado;</li>
                <li>atendemos solicitações de acesso, correção, oposição e eliminação pelos canais indicados nesta Política.</li>
              </ul>
              <p className={paragraphClassName}>
                A Meta trata dados em suas próprias plataformas de acordo com seus termos e sua política de
                privacidade, atuando de forma independente em relação a esses tratamentos.
              </p>
              <a
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-brand-primary hover:underline"
              >
                Consultar a Política de Privacidade da Meta
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </section>

            <section className={sectionClassName} aria-labelledby="cookies-titulo">
              <h2 id="cookies-titulo" className={headingClassName}>5. Cookies e tecnologias semelhantes</h2>
              <p className={paragraphClassName}>
                O site pode utilizar cookies estritamente necessários para segurança, autenticação e funcionamento.
                Caso ferramentas opcionais de análise ou publicidade, como o Meta Pixel, sejam ativadas, elas poderão
                registrar eventos de navegação para mensuração de campanhas e criação de públicos, observadas as
                escolhas de consentimento exigidas pela legislação aplicável.
              </p>
              <p className={paragraphClassName}>
                Você pode controlar ou apagar cookies nas configurações do navegador. O bloqueio de cookies
                essenciais pode afetar algumas funcionalidades. Preferências de anúncios da Meta também podem ser
                gerenciadas diretamente nas configurações do Facebook e do Instagram.
              </p>
            </section>

            <section id="compartilhamento" className={sectionClassName} aria-labelledby="compartilhamento-titulo">
              <h2 id="compartilhamento-titulo" className={headingClassName}>6. Com quem os dados podem ser compartilhados</h2>
              <p className={paragraphClassName}>
                Compartilhamos dados apenas quando necessário para as finalidades desta Política, inclusive com
                provedores de hospedagem e segurança (Vercel), banco de dados de leads (Supabase), gerenciamento de
                conteúdo e imagens (Sanity), comunicação (WhatsApp e e-mail), Meta, assessoria técnica, jurídica ou
                contábil e autoridades públicas quando houver obrigação legal.
              </p>
              <p className={paragraphClassName}>
                Alguns fornecedores podem processar dados fora do Brasil. Nesses casos, buscamos utilizar prestadores
                que adotem medidas de segurança e mecanismos compatíveis com a LGPD. Os prestadores recebem apenas os
                dados necessários e devem tratá-los conforme nossas instruções e a legislação aplicável, quando atuam
                como operadores.
              </p>
            </section>

            <section className={sectionClassName} aria-labelledby="retencao-titulo">
              <h2 id="retencao-titulo" className={headingClassName}>7. Por quanto tempo mantemos os dados</h2>
              <p className={paragraphClassName}>
                Mantemos os dados durante o atendimento e a negociação e, depois disso, somente pelo período
                necessário para cumprir as finalidades informadas, obrigações legais, prazos aplicáveis e o exercício
                regular de direitos. Quando deixam de ser necessários, os dados são eliminados ou anonimizados dentro
                dos limites técnicos e legais. Você pode solicitar a eliminação a qualquer momento, ressalvadas as
                hipóteses de conservação autorizadas pela LGPD.
              </p>
            </section>

            <section className={sectionClassName} aria-labelledby="seguranca-titulo">
              <h2 id="seguranca-titulo" className={headingClassName}>8. Como protegemos os dados</h2>
              <p className={paragraphClassName}>
                Adotamos medidas técnicas e administrativas razoáveis para proteger os dados contra acesso não
                autorizado, perda, alteração, divulgação ou destruição. Entre elas estão conexões seguras, controle de
                acesso ao painel e limitação do acesso às pessoas que precisam tratar os dados. Nenhum sistema é
                totalmente imune a riscos, mas revisamos as medidas de proteção de acordo com a natureza dos dados e
                do tratamento.
              </p>
            </section>

            <section id="direitos" className={sectionClassName} aria-labelledby="direitos-titulo">
              <h2 id="direitos-titulo" className={headingClassName}>9. Seus direitos conforme a LGPD</h2>
              <p className={paragraphClassName}>Você pode solicitar, quando aplicável:</p>
              <ul className={listClassName}>
                <li>confirmação da existência de tratamento e acesso aos dados;</li>
                <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade;</li>
                <li>portabilidade, observadas a regulamentação e os segredos comercial e industrial;</li>
                <li>informação sobre entidades com as quais houve compartilhamento;</li>
                <li>revogação do consentimento e eliminação dos dados tratados com base nele, ressalvadas as exceções legais;</li>
                <li>oposição a tratamento realizado em desacordo com a LGPD e revisão de decisão automatizada, se houver.</li>
              </ul>
              <p className={paragraphClassName}>
                Para proteger sua privacidade, poderemos solicitar informações necessárias para confirmar sua
                identidade. Responderemos dentro dos prazos legais e explicaremos eventual impossibilidade de atender
                integralmente ao pedido.
              </p>
            </section>

            <section className={sectionClassName} aria-labelledby="menores-titulo">
              <h2 id="menores-titulo" className={headingClassName}>10. Dados de crianças e adolescentes</h2>
              <p className={paragraphClassName}>
                Nossos serviços e campanhas de captação imobiliária não são direcionados a menores de 18 anos. Se
                identificarmos a coleta indevida de dados de menor sem a participação de seu responsável legal,
                tomaremos medidas razoáveis para eliminá-los.
              </p>
            </section>

            <section className={sectionClassName} aria-labelledby="terceiros-titulo">
              <h2 id="terceiros-titulo" className={headingClassName}>11. Links e conteúdos de terceiros</h2>
              <p className={paragraphClassName}>
                O site pode apresentar links, mapas, vídeos ou botões que levam a serviços de terceiros, como
                WhatsApp, Google Maps, YouTube, Vimeo, Facebook e Instagram. O tratamento realizado nesses ambientes
                é regido pelas políticas dos respectivos responsáveis. Recomendamos a leitura desses documentos antes
                de fornecer dados pessoais.
              </p>
            </section>

            <section className={sectionClassName} aria-labelledby="alteracoes-titulo">
              <h2 id="alteracoes-titulo" className={headingClassName}>12. Alterações nesta Política</h2>
              <p className={paragraphClassName}>
                Esta Política pode ser atualizada para refletir mudanças no site, nos serviços ou na legislação. A
                versão vigente estará sempre disponível nesta página, com a data da última atualização. Mudanças
                relevantes poderão ser comunicadas pelos canais de contato disponíveis.
              </p>
            </section>

            <section id="contato-privacidade" className="scroll-mt-28 rounded-2xl border border-orange-100 bg-orange-50 p-6 sm:p-8" aria-labelledby="contato-titulo">
              <h2 id="contato-titulo" className={headingClassName}>13. Contato e solicitações sobre privacidade</h2>
              <p className="mt-4 leading-7 text-slate-700">
                Para exercer direitos, pedir a exclusão dos seus dados ou tirar dúvidas, envie um e-mail para{" "}
                <a href={`mailto:${contactEmail}?subject=Privacidade%20-%20Solicitação%20do%20titular`} className="font-bold text-brand-primary hover:underline">
                  {contactEmail}
                </a>{" "}
                com o assunto “Privacidade — Solicitação do titular”. Informe o e-mail ou telefone usado no contato
                para que possamos localizar o cadastro com segurança.
              </p>
            </section>

            <div className="border-t border-slate-200 pt-6 text-sm text-slate-500">
              <Link href="/" className="font-semibold text-brand-primary hover:underline">
                Voltar para a página inicial
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
