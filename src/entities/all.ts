// Mock data and entity classes for the BabbleBear application

export interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  medical_notes?: string;
  notes?: string;
  created_date: string;
}

export interface BabbleSession {
  id: string;
  child_id: string;
  duration_seconds: number;
  babble_score: number;
  analysis_results: any;
  session_date: string;
}

export interface ParentNote {
  id: string;
  child_id: string;
  content: string;
  created_date: string;
}

// Mock Child class
class ChildEntity {
  static async list(sortBy: string = "-created_date"): Promise<Child[]> {
    // Mock data
    return [
      {
        id: "1",
        name: "Emma",
        birth_date: "2023-06-14",
        gender: "girl",
        medical_notes: "Born at 38 weeks, healthy development",
        notes: "Born at 38 weeks, healthy development",
        created_date: "2023-06-14T00:00:00Z"
      },
      {
        id: "2",
        name: "Oliver",
        birth_date: "2023-03-21",
        gender: "boy",
        created_date: "2023-03-21T00:00:00Z"
      }
    ];
  }

  static async create(data: Partial<Child>): Promise<Child> {
    const newChild: Child = {
      id: Date.now().toString(),
      name: data.name || "",
      birth_date: data.birth_date || "",
      gender: data.gender,
      medical_notes: data.medical_notes,
      notes: data.notes,
      created_date: new Date().toISOString()
    };
    return newChild;
  }

  static async update(id: string, data: Partial<Child>): Promise<Child> {
    // Mock update
    return {
      id,
      name: data.name || "",
      birth_date: data.birth_date || "",
      gender: data.gender,
      medical_notes: data.medical_notes,
      notes: data.notes,
      created_date: new Date().toISOString()
    };
  }
}

// Mock BabbleSession class
class BabbleSessionEntity {
  static async list(sortBy: string = "-session_date", limit: number = 10): Promise<BabbleSession[]> {
    // Mock data with more realistic progression
    const now = new Date();
    return [
      // Emma's sessions (improving trend)
      {
        id: "1",
        child_id: "1",
        duration_seconds: 180,
        babble_score: 45,
        analysis_results: {},
        session_date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "2",
        child_id: "1",
        duration_seconds: 195,
        babble_score: 52,
        analysis_results: {},
        session_date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        child_id: "1",
        duration_seconds: 210,
        babble_score: 58,
        analysis_results: {},
        session_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "4",
        child_id: "1",
        duration_seconds: 185,
        babble_score: 65,
        analysis_results: {},
        session_date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "5",
        child_id: "1",
        duration_seconds: 200,
        babble_score: 72,
        analysis_results: {},
        session_date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "6",
        child_id: "1",
        duration_seconds: 220,
        babble_score: 78,
        analysis_results: {},
        session_date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "7",
        child_id: "1",
        duration_seconds: 195,
        babble_score: 85,
        analysis_results: {},
        session_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "8",
        child_id: "1",
        duration_seconds: 210,
        babble_score: 89,
        analysis_results: {},
        session_date: now.toISOString()
      },
      // Oliver's sessions (declining trend with some low scores)
      {
        id: "9",
        child_id: "2",
        duration_seconds: 180,
        babble_score: 82,
        analysis_results: {},
        session_date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "10",
        child_id: "2",
        duration_seconds: 175,
        babble_score: 78,
        analysis_results: {},
        session_date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "11",
        child_id: "2",
        duration_seconds: 190,
        babble_score: 45,
        analysis_results: {},
        session_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "12",
        child_id: "2",
        duration_seconds: 165,
        babble_score: 38,
        analysis_results: {},
        session_date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "13",
        child_id: "2",
        duration_seconds: 200,
        babble_score: 67,
        analysis_results: {},
        session_date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "14",
        child_id: "2",
        duration_seconds: 185,
        babble_score: 42,
        analysis_results: {},
        session_date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "15",
        child_id: "2",
        duration_seconds: 195,
        babble_score: 73,
        analysis_results: {},
        session_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "16",
        child_id: "2",
        duration_seconds: 210,
        babble_score: 68,
        analysis_results: {},
        session_date: now.toISOString()
      }
    ];
  }

  static async create(data: Partial<BabbleSession>): Promise<BabbleSession> {
    const newSession: BabbleSession = {
      id: Date.now().toString(),
      child_id: data.child_id || "",
      duration_seconds: data.duration_seconds || 0,
      babble_score: data.babble_score || 0,
      analysis_results: data.analysis_results || {},
      session_date: data.session_date || new Date().toISOString()
    };
    return newSession;
  }
}

// Export the classes
export { ChildEntity as Child, BabbleSessionEntity as BabbleSession }; 