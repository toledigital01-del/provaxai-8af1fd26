export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          acao: string
          admin_id: string | null
          alvo_id: string | null
          alvo_tipo: string | null
          created_at: string
          detalhes: Json
          id: string
        }
        Insert: {
          acao: string
          admin_id?: string | null
          alvo_id?: string | null
          alvo_tipo?: string | null
          created_at?: string
          detalhes?: Json
          id?: string
        }
        Update: {
          acao?: string
          admin_id?: string | null
          alvo_id?: string | null
          alvo_tipo?: string | null
          created_at?: string
          detalhes?: Json
          id?: string
        }
        Relationships: []
      }
      ai_logs: {
        Row: {
          created_at: string
          custo_cents: number
          discipline_nome: string | null
          ferramenta: string | null
          id: string
          modelo: string | null
          pergunta: string | null
          resposta: string | null
          tokens_entrada: number
          tokens_saida: number
          topic_nome: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          custo_cents?: number
          discipline_nome?: string | null
          ferramenta?: string | null
          id?: string
          modelo?: string | null
          pergunta?: string | null
          resposta?: string | null
          tokens_entrada?: number
          tokens_saida?: number
          topic_nome?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          custo_cents?: number
          discipline_nome?: string | null
          ferramenta?: string | null
          id?: string
          modelo?: string | null
          pergunta?: string | null
          resposta?: string | null
          tokens_entrada?: number
          tokens_saida?: number
          topic_nome?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_settings: {
        Row: {
          ativo: boolean
          chave: string
          id: string
          limite_diario: number
          modelo: string
          prompt: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          chave: string
          id?: string
          limite_diario?: number
          modelo?: string
          prompt?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          chave?: string
          id?: string
          limite_diario?: number
          modelo?: string
          prompt?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          chave: string
          created_at: string
          id: string
          updated_at: string
          updated_by: string | null
          valor: string
        }
        Insert: {
          chave: string
          created_at?: string
          id?: string
          updated_at?: string
          updated_by?: string | null
          valor: string
        }
        Update: {
          chave?: string
          created_at?: string
          id?: string
          updated_at?: string
          updated_by?: string | null
          valor?: string
        }
        Relationships: []
      }
      aula_recursos: {
        Row: {
          course_slug: string
          created_at: string
          dados: Json
          disciplina: string
          id: string
          modelo: string | null
          tipo: string
          topico: string | null
          updated_at: string
        }
        Insert: {
          course_slug: string
          created_at?: string
          dados?: Json
          disciplina: string
          id?: string
          modelo?: string | null
          tipo: string
          topico?: string | null
          updated_at?: string
        }
        Update: {
          course_slug?: string
          created_at?: string
          dados?: Json
          disciplina?: string
          id?: string
          modelo?: string | null
          tipo?: string
          topico?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      aulas_ia: {
        Row: {
          conteudo: string
          course_slug: string
          created_at: string
          disciplina: string
          id: string
          modelo: string | null
          titulo: string | null
          topico: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          conteudo: string
          course_slug: string
          created_at?: string
          disciplina: string
          id?: string
          modelo?: string | null
          titulo?: string | null
          topico: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          conteudo?: string
          course_slug?: string
          created_at?: string
          disciplina?: string
          id?: string
          modelo?: string | null
          titulo?: string | null
          topico?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          desconto_cents: number
          desconto_percent: number
          expira_em: string | null
          id: string
          usos: number
          usos_maximos: number | null
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          desconto_cents?: number
          desconto_percent?: number
          expira_em?: string | null
          id?: string
          usos?: number
          usos_maximos?: number | null
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          desconto_cents?: number
          desconto_percent?: number
          expira_em?: string | null
          id?: string
          usos?: number
          usos_maximos?: number | null
        }
        Relationships: []
      }
      course_access: {
        Row: {
          course_id: string
          created_at: string
          expira_em: string | null
          id: string
          origem: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          expira_em?: string | null
          id?: string
          origem?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          expira_em?: string | null
          id?: string
          origem?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_access_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          banner_url: string | null
          capa_url: string | null
          categoria: string | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          ordem: number
          preco_cents: number
          professor: string | null
          slug: string
          status: Database["public"]["Enums"]["course_status"]
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          capa_url?: string | null
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number
          preco_cents?: number
          professor?: string | null
          slug: string
          status?: Database["public"]["Enums"]["course_status"]
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          capa_url?: string | null
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number
          preco_cents?: number
          professor?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["course_status"]
          updated_at?: string
        }
        Relationships: []
      }
      disciplines: {
        Row: {
          area: string
          course_id: string
          created_at: string
          id: string
          incidencia: number
          nome: string
          ordem: number
          peso: number
        }
        Insert: {
          area?: string
          course_id: string
          created_at?: string
          id?: string
          incidencia?: number
          nome: string
          ordem?: number
          peso?: number
        }
        Update: {
          area?: string
          course_id?: string
          created_at?: string
          id?: string
          incidencia?: number
          nome?: string
          ordem?: number
          peso?: number
        }
        Relationships: [
          {
            foreignKeyName: "disciplines_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      dominio_snapshots: {
        Row: {
          acertos_pct: number
          course_slug: string
          created_at: string
          dia: string
          dominio: number
          id: string
          por_disciplina: Json
          questoes: number
          tempo_segundos: number
          user_id: string
        }
        Insert: {
          acertos_pct?: number
          course_slug?: string
          created_at?: string
          dia?: string
          dominio?: number
          id?: string
          por_disciplina?: Json
          questoes?: number
          tempo_segundos?: number
          user_id: string
        }
        Update: {
          acertos_pct?: number
          course_slug?: string
          created_at?: string
          dia?: string
          dominio?: number
          id?: string
          por_disciplina?: Json
          questoes?: number
          tempo_segundos?: number
          user_id?: string
        }
        Relationships: []
      }
      flashcard_reviews: {
        Row: {
          card_id: string
          created_at: string
          due_at: string
          ease: number
          id: string
          intervalo_dias: number
          last_review_at: string
          repeticoes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          due_at?: string
          ease?: number
          id?: string
          intervalo_dias?: number
          last_review_at?: string
          repeticoes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          due_at?: string
          ease?: number
          id?: string
          intervalo_dias?: number
          last_review_at?: string
          repeticoes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_reviews_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          course_slug: string | null
          created_at: string
          discipline_nome: string | null
          due_at: string
          ease: number
          frente: string
          id: string
          intervalo_dias: number
          is_oficial: boolean
          status: Database["public"]["Enums"]["topic_status"]
          topic_nome: string | null
          updated_at: string
          user_id: string | null
          verso: string
        }
        Insert: {
          course_slug?: string | null
          created_at?: string
          discipline_nome?: string | null
          due_at?: string
          ease?: number
          frente: string
          id?: string
          intervalo_dias?: number
          is_oficial?: boolean
          status?: Database["public"]["Enums"]["topic_status"]
          topic_nome?: string | null
          updated_at?: string
          user_id?: string | null
          verso: string
        }
        Update: {
          course_slug?: string | null
          created_at?: string
          discipline_nome?: string | null
          due_at?: string
          ease?: number
          frente?: string
          id?: string
          intervalo_dias?: number
          is_oficial?: boolean
          status?: Database["public"]["Enums"]["topic_status"]
          topic_nome?: string | null
          updated_at?: string
          user_id?: string | null
          verso?: string
        }
        Relationships: []
      }
      folders: {
        Row: {
          created_at: string
          id: string
          nome: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
      kb_documentos: {
        Row: {
          course_slug: string
          criado_em: string
          discipline_nome: string
          enviado_por: string | null
          id: string
          nome_arquivo: string
          origem_url: string | null
          status_direitos: string
          texto_extraido: string
          tipo: string
          topic_nome: string | null
        }
        Insert: {
          course_slug?: string
          criado_em?: string
          discipline_nome: string
          enviado_por?: string | null
          id?: string
          nome_arquivo: string
          origem_url?: string | null
          status_direitos?: string
          texto_extraido?: string
          tipo?: string
          topic_nome?: string | null
        }
        Update: {
          course_slug?: string
          criado_em?: string
          discipline_nome?: string
          enviado_por?: string | null
          id?: string
          nome_arquivo?: string
          origem_url?: string | null
          status_direitos?: string
          texto_extraido?: string
          tipo?: string
          topic_nome?: string | null
        }
        Relationships: []
      }
      knowledge_docs: {
        Row: {
          conteudo: string
          course_slug: string
          created_at: string
          disciplina: string
          id: string
          modo_exibicao: string
          ordem: number
          pdf_url: string | null
          publicado: boolean
          status: string
          sumario: string | null
          titulo: string | null
          topico: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          conteudo?: string
          course_slug?: string
          created_at?: string
          disciplina: string
          id?: string
          modo_exibicao?: string
          ordem?: number
          pdf_url?: string | null
          publicado?: boolean
          status?: string
          sumario?: string | null
          titulo?: string | null
          topico?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          conteudo?: string
          course_slug?: string
          created_at?: string
          disciplina?: string
          id?: string
          modo_exibicao?: string
          ordem?: number
          pdf_url?: string | null
          publicado?: boolean
          status?: string
          sumario?: string | null
          titulo?: string | null
          topico?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      login_events: {
        Row: {
          created_at: string
          id: string
          ip: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          conteudo: string
          created_at: string
          discipline_nome: string | null
          id: string
          titulo: string | null
          topic_nome: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          conteudo?: string
          created_at?: string
          discipline_nome?: string | null
          id?: string
          titulo?: string | null
          topic_nome?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          discipline_nome?: string | null
          id?: string
          titulo?: string | null
          topic_nome?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          intervalo: string
          nome: string
          ordem: number
          preco_cents: number
          recursos: Json
          slug: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          intervalo?: string
          nome: string
          ordem?: number
          preco_cents?: number
          recursos?: Json
          slug: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          intervalo?: string
          nome?: string
          ordem?: number
          preco_cents?: number
          recursos?: Json
          slug?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          chave: string
          id: string
          publico: boolean
          updated_at: string
          valor: Json
        }
        Insert: {
          chave: string
          id?: string
          publico?: boolean
          updated_at?: string
          valor?: Json
        }
        Update: {
          chave?: string
          id?: string
          publico?: boolean
          updated_at?: string
          valor?: Json
        }
        Relationships: []
      }
      podcasts_ia: {
        Row: {
          course_slug: string
          created_at: string
          disciplina: string
          id: string
          modelo: string | null
          roteiro: Json
          topico: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          course_slug: string
          created_at?: string
          disciplina: string
          id?: string
          modelo?: string | null
          roteiro: Json
          topico?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          course_slug?: string
          created_at?: string
          disciplina?: string
          id?: string
          modelo?: string | null
          roteiro?: Json
          topico?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_login_at: string | null
          phone: string | null
          suspended: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_login_at?: string | null
          phone?: string | null
          suspended?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          phone?: string | null
          suspended?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          course_id: string | null
          created_at: string
          cupom: string | null
          id: string
          provider: string | null
          provider_payment_id: string | null
          reembolsado_em: string | null
          status: string
          user_id: string
          valor_cents: number
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          cupom?: string | null
          id?: string
          provider?: string | null
          provider_payment_id?: string | null
          reembolsado_em?: string | null
          status?: string
          user_id: string
          valor_cents?: number
        }
        Update: {
          course_id?: string | null
          created_at?: string
          cupom?: string | null
          id?: string
          provider?: string | null
          provider_payment_id?: string | null
          reembolsado_em?: string | null
          status?: string
          user_id?: string
          valor_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      question_attempts: {
        Row: {
          correta: boolean
          created_at: string
          discipline_nome: string | null
          id: string
          question_id: string | null
          resposta: string | null
          segundos: number
          topic_nome: string | null
          user_id: string
        }
        Insert: {
          correta?: boolean
          created_at?: string
          discipline_nome?: string | null
          id?: string
          question_id?: string | null
          resposta?: string | null
          segundos?: number
          topic_nome?: string | null
          user_id: string
        }
        Update: {
          correta?: boolean
          created_at?: string
          discipline_nome?: string | null
          id?: string
          question_id?: string | null
          resposta?: string | null
          segundos?: number
          topic_nome?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          alternativas: Json
          ano: number | null
          ativa: boolean
          banca: string | null
          comentario: string | null
          course_slug: string | null
          created_at: string
          discipline_nome: string
          enunciado: string
          gabarito: string
          id: string
          tipo: string
          topic_nome: string | null
          updated_at: string
        }
        Insert: {
          alternativas?: Json
          ano?: number | null
          ativa?: boolean
          banca?: string | null
          comentario?: string | null
          course_slug?: string | null
          created_at?: string
          discipline_nome: string
          enunciado: string
          gabarito: string
          id?: string
          tipo?: string
          topic_nome?: string | null
          updated_at?: string
        }
        Update: {
          alternativas?: Json
          ano?: number | null
          ativa?: boolean
          banca?: string | null
          comentario?: string | null
          course_slug?: string | null
          created_at?: string
          discipline_nome?: string
          enunciado?: string
          gabarito?: string
          id?: string
          tipo?: string
          topic_nome?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      study_blocks: {
        Row: {
          concluido: boolean
          created_at: string
          dia: string
          discipline_nome: string
          id: string
          minutos: number
          topic_nome: string | null
          user_id: string
        }
        Insert: {
          concluido?: boolean
          created_at?: string
          dia: string
          discipline_nome: string
          id?: string
          minutos?: number
          topic_nome?: string | null
          user_id: string
        }
        Update: {
          concluido?: boolean
          created_at?: string
          dia?: string
          discipline_nome?: string
          id?: string
          minutos?: number
          topic_nome?: string | null
          user_id?: string
        }
        Relationships: []
      }
      study_plans: {
        Row: {
          course_slug: string | null
          created_at: string
          data_prova: string | null
          dias_descanso: Json
          horas_por_dia: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          course_slug?: string | null
          created_at?: string
          data_prova?: string | null
          dias_descanso?: Json
          horas_por_dia?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          course_slug?: string | null
          created_at?: string
          data_prova?: string | null
          dias_descanso?: Json
          horas_por_dia?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          created_at: string
          discipline_nome: string | null
          ferramenta: string | null
          id: string
          segundos: number
          started_at: string
          topic_nome: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          discipline_nome?: string | null
          ferramenta?: string | null
          id?: string
          segundos?: number
          started_at?: string
          topic_nome?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          discipline_nome?: string | null
          ferramenta?: string | null
          id?: string
          segundos?: number
          started_at?: string
          topic_nome?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          created_at: string
          current_period_end: string | null
          id: string
          plan_id: string | null
          provider: string | null
          provider_subscription_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string | null
          provider?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string | null
          provider?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assunto: string
          created_at: string
          descricao: string
          id: string
          prioridade: string
          status: string
          tipo: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assunto: string
          created_at?: string
          descricao?: string
          id?: string
          prioridade?: string
          status?: string
          tipo?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assunto?: string
          created_at?: string
          descricao?: string
          id?: string
          prioridade?: string
          status?: string
          tipo?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          mensagem: string
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mensagem: string
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mensagem?: string
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_progress: {
        Row: {
          course_slug: string
          created_at: string
          discipline_nome: string
          dominio: number
          id: string
          last_access_at: string
          questoes_certas: number
          questoes_respondidas: number
          status: Database["public"]["Enums"]["topic_status"]
          tempo_segundos: number
          topic_nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          course_slug?: string
          created_at?: string
          discipline_nome: string
          dominio?: number
          id?: string
          last_access_at?: string
          questoes_certas?: number
          questoes_respondidas?: number
          status?: Database["public"]["Enums"]["topic_status"]
          tempo_segundos?: number
          topic_nome: string
          updated_at?: string
          user_id: string
        }
        Update: {
          course_slug?: string
          created_at?: string
          discipline_nome?: string
          dominio?: number
          id?: string
          last_access_at?: string
          questoes_certas?: number
          questoes_respondidas?: number
          status?: Database["public"]["Enums"]["topic_status"]
          tempo_segundos?: number
          topic_nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          dificuldade: string
          discipline_id: string
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          created_at?: string
          dificuldade?: string
          discipline_id: string
          id?: string
          nome: string
          ordem?: number
        }
        Update: {
          created_at?: string
          dificuldade?: string
          discipline_id?: string
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: [
          {
            foreignKeyName: "topics_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      tts_cache: {
        Row: {
          caminho: string
          caracteres: number
          created_at: string
          hash: string
          provedor: string | null
          usos: number
          voz: string
        }
        Insert: {
          caminho: string
          caracteres?: number
          created_at?: string
          hash: string
          provedor?: string | null
          usos?: number
          voz: string
        }
        Update: {
          caminho?: string
          caracteres?: number
          created_at?: string
          hash?: string
          provedor?: string | null
          usos?: number
          voz?: string
        }
        Relationships: []
      }
      user_materials: {
        Row: {
          conteudo: string | null
          created_at: string
          folder_id: string | null
          id: string
          nome: string
          source_url: string | null
          storage_path: string | null
          tipo: string
          topics: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          conteudo?: string | null
          created_at?: string
          folder_id?: string | null
          id?: string
          nome: string
          source_url?: string | null
          storage_path?: string | null
          tipo?: string
          topics?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          conteudo?: string | null
          created_at?: string
          folder_id?: string | null
          id?: string
          nome?: string
          source_url?: string | null
          storage_path?: string | null
          tipo?: string
          topics?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_materials_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      has_course_access: { Args: { _slug: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_support: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "suporte" | "aluno"
      course_status: "rascunho" | "publicado" | "em_breve"
      topic_status: "nao" | "apr" | "fam" | "dom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "suporte", "aluno"],
      course_status: ["rascunho", "publicado", "em_breve"],
      topic_status: ["nao", "apr", "fam", "dom"],
    },
  },
} as const
