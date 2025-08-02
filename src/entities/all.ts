// Mock data and entity classes for the BabbleBear application

export interface Child {
  id: string;
  name: string;
  birth_date: string;
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
        notes: "Born at 38 weeks, healthy development",
        created_date: "2023-06-14T00:00:00Z"
      },
      {
        id: "2",
        name: "Oliver",
        birth_date: "2023-03-21",
        created_date: "2023-03-21T00:00:00Z"
      }
    ];
  }

  static async create(data: Partial<Child>): Promise<Child> {
    const newChild: Child = {
      id: Date.now().toString(),
      name: data.name || "",
      birth_date: data.birth_date || "",
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
      notes: data.notes,
      created_date: new Date().toISOString()
    };
  }
}

// Mock BabbleSession class
class BabbleSessionEntity {
  static async list(sortBy: string = "-session_date", limit: number = 10): Promise<BabbleSession[]> {
    // Mock data
    return [
      {
        id: "1",
        child_id: "1",
        duration_seconds: 180,
        babble_score: 0,
        analysis_results: {},
        session_date: new Date().toISOString()
      },
      {
        id: "2",
        child_id: "2",
        duration_seconds: 180,
        babble_score: 87,
        analysis_results: {},
        session_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        child_id: "2",
        duration_seconds: 150,
        babble_score: 73,
        analysis_results: {},
        session_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "4",
        child_id: "2",
        duration_seconds: 225,
        babble_score: 92,
        analysis_results: {},
        session_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
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