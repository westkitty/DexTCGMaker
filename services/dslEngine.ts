
export interface DSLEffect {
  trigger: string;
  action: string;
  value?: number;
  keywords: string[];
  params?: Record<string, any>;
}

export const DSLEngine = {
  /**
   * Enhanced parser supporting:
   * "wincon: score_target { scoreType: 'lore', target: 20 }"
   * "mechanic: dynamic_rule { rule: 'max_hand_size=8' }"
   */
  parse: (ruleText: string): DSLEffect[] => {
    const lines = ruleText.split('\n').filter(l => l.trim() !== '');
    const results: DSLEffect[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Handle prefix-based rules (wincon:, mechanic:)
      if (trimmed.startsWith('wincon:') || trimmed.startsWith('mechanic:')) {
        const [prefix, rest] = trimmed.split(':').map(s => s.trim());
        const actionMatch = rest.match(/^[^{]+/);
        const action = actionMatch ? actionMatch[0].trim() : 'Unknown';
        
        const paramMatch = rest.match(/\{(.+)\}/);
        let params: Record<string, any> = {};
        if (paramMatch) {
          try {
            // Very simple pseudo-JSON parser for DSL
            const paramStr = paramMatch[1];
            paramStr.split(',').forEach(pair => {
              const [k, v] = pair.split(':').map(s => s.trim().replace(/['"]/g, ''));
              params[k] = isNaN(Number(v)) ? v : Number(v);
            });
          } catch (e) {
            console.error("DSL Param Parse Error", e);
          }
        }
        
        results.push({ trigger: prefix === 'wincon' ? 'Victory' : 'Global', action, params, keywords: [] });
        return;
      }

      const parts = trimmed.split(':').map(s => s.trim());
      if (parts.length < 2) {
        results.push({ trigger: 'Passive', action: parts[0], keywords: [], value: undefined });
        return;
      }

      const trigger = parts[0];
      const rest = parts.slice(1).join(':');

      if (trigger.toLowerCase() === 'keyword') {
        const keywords = rest.split(',').map(k => k.trim());
        results.push({ trigger: 'Keyword', action: 'Apply Keywords', keywords, value: undefined });
      } else {
        const valueMatch = rest.match(/\d+/);
        const value = valueMatch ? parseInt(valueMatch[0]) : undefined;
        results.push({ trigger, action: rest, keywords: [], value });
      }
    });

    return results;
  },

  getKeywords: (ruleText: string): string[] => {
    const parsed = DSLEngine.parse(ruleText);
    const keywordEffect = parsed.find(p => p.trigger === 'Keyword');
    return keywordEffect ? keywordEffect.keywords : [];
  },

  interpret: (ruleText: string, context: any) => {
    const effects = DSLEngine.parse(ruleText);
    return effects;
  }
};
