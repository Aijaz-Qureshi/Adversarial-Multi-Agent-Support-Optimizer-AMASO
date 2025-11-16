# Adversarial Multi-Agent Support System
## Complete Troubleshooting Guide

**Version**: 1.0  
**Last Updated**: November 2025  
**Support**: troubleshooting@adversarial-agents.com

---

## 🚨 QUICK DIAGNOSIS MATRIX

| Symptom | Likely Cause | Quick Fix | Detailed Section |
|---------|--------------|-----------|------------------|
| System won't start | Missing API key | Check Gemini API key configuration | [Setup Issues](#setup-issues) |
| All agents propose same solution | Agent weights misconfigured | Reset to default weights | [Agent Issues](#agent-behavior-issues) |
| Costs too high | Advocate agent weighted too heavily | Increase Efficiency weight | [Cost Problems](#cost-optimization-issues) |
| Satisfaction dropping | Efficiency agent weighted too heavily | Increase Advocate weight | [Satisfaction Issues](#customer-satisfaction-issues) |
| Dashboards blank | No tickets processed | Run process_batch() first | [Dashboard Issues](#dashboard-visualization-issues) |
| API errors | Rate limiting or quota | Check API usage limits | [API Issues](#api-connection-issues) |
| Slow performance | Sequential API calls | Enable batch processing | [Performance Issues](#performance-optimization) |
| Nash solutions identical | Convergence failure | Adjust optimization bounds | [Nash Issues](#nash-equilibrium-problems) |

---

## 📋 TABLE OF CONTENTS

1. [Setup & Installation Issues](#setup-issues)
2. [API Connection Issues](#api-connection-issues)
3. [Agent Behavior Issues](#agent-behavior-issues)
4. [Nash Equilibrium Problems](#nash-equilibrium-problems)
5. [Dashboard Visualization Issues](#dashboard-visualization-issues)
6. [Data Quality Issues](#data-quality-issues)
7. [Performance Optimization](#performance-optimization)
8. [Cost Optimization Issues](#cost-optimization-issues)
9. [Customer Satisfaction Issues](#customer-satisfaction-issues)
10. [Integration Issues](#integration-issues)
11. [Emergency Procedures](#emergency-procedures)

---

## 🔧 SETUP ISSUES

### Problem 1.1: "Module not found" errors

**Symptoms**:
```
ModuleNotFoundError: No module named 'google.generativeai'
```

**Diagnosis**:
Missing package installations in Kaggle environment

**Solution**:
```python
# Run in first cell
!pip install -q google-generativeai plotly scipy pandas numpy

# Restart kernel after installation
import IPython
IPython.Application.instance().kernel.do_shutdown(True)
```

**Prevention**:
- Always run pip install cell before importing libraries
- Use `-q` flag for quiet installation in Kaggle
- Check Kaggle's default installed packages first

---

### Problem 1.2: "Invalid API key" error

**Symptoms**:
```
google.api_core.exceptions.PermissionDenied: 403 API key not valid
```

**Diagnosis**:
- API key not set or incorrect
- API key doesn't have Gemini API enabled

**Solution**:
```python
# Step 1: Get a valid API key
# Visit: https://aistudio.google.com/app/apikey
# Click "Create API Key"

# Step 2: Test the key
import google.generativeai as genai

GEMINI_API_KEY = "your-actual-key-here"  # Replace this
genai.configure(api_key=GEMINI_API_KEY)

# Step 3: Test connection
model = genai.GenerativeModel('gemini-2.0-flash-exp')
response = model.generate_content("Say hello")
print(response.text)  # Should print a greeting
```

**Prevention**:
- Store API key in Kaggle Secrets (safer than hardcoding)
- Use environment variables: `os.environ['GEMINI_API_KEY']`
- Never commit API keys to public repositories

---

### Problem 1.3: Kernel crashes during initialization

**Symptoms**:
- Kernel dies when initializing agents
- "Out of memory" errors
- System becomes unresponsive

**Diagnosis**:
Trying to process too many tickets at once or memory leak

**Solution**:
```python
# Start with small batch
system = AdversarialSupportSystem()
results_df = system.process_batch(num_tickets=5)  # Not 500!

# If successful, gradually increase
results_df = system.process_batch(num_tickets=10)
results_df = system.process_batch(num_tickets=50)

# For full 500 tickets, use batching
def process_large_batch(system, total_tickets=500, batch_size=50):
    all_results = []
    for i in range(0, total_tickets, batch_size):
        print(f"Processing batch {i//batch_size + 1}...")
        batch_results = system.process_batch(num_tickets=batch_size)
        all_results.append(batch_results)
    return pd.concat(all_results, ignore_index=True)
```

**Prevention**:
- Always start with small test batches
- Monitor memory usage in Kaggle
- Clear variables between runs: `del system; gc.collect()`

---

## 🌐 API CONNECTION ISSUES

### Problem 2.1: Rate limiting errors

**Symptoms**:
```
google.api_core.exceptions.ResourceExhausted: 429 Quota exceeded
```

**Diagnosis**:
Making too many API calls too quickly (Gemini has rate limits)

**Solution**:
```python
import time

# Add delay between tickets
def process_ticket_with_retry(self, ticket, max_retries=3):
    for attempt in range(max_retries):
        try:
            result = self.process_ticket(ticket)
            time.sleep(0.5)  # 500ms delay between tickets
            return result
        except Exception as e:
            if "429" in str(e):
                wait_time = (2 ** attempt) * 2  # Exponential backoff
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise e
    raise Exception("Max retries exceeded")
```

**Rate Limits** (as of Nov 2025):
- Free tier: 60 requests/minute
- Paid tier: 1000 requests/minute

**Prevention**:
- Add `time.sleep(1)` between API calls
- Use batch processing for large volumes
- Upgrade to paid tier for production use

---

### Problem 2.2: Timeout errors

**Symptoms**:
```
TimeoutError: Request timed out after 30 seconds
```

**Diagnosis**:
- Network issues
- Gemini API overloaded
- Prompt too complex

**Solution**:
```python
# Configure timeout
model = genai.GenerativeModel(
    'gemini-2.0-flash-exp',
    generation_config={'timeout': 60}  # Increase to 60s
)

# Add retry logic
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def call_gemini_with_retry(prompt):
    response = model.generate_content(prompt)
    return response.text
```

**Prevention**:
- Keep prompts concise (<2000 tokens)
- Use faster Gemini models for simple tasks
- Implement proper timeout handling

---

### Problem 2.3: Authentication failures

**Symptoms**:
```
Error: Could not load credentials
```

**Diagnosis**:
API key not properly configured or expired

**Solution**:
```python
# Verify API key is active
import google.generativeai as genai

# Method 1: Direct configuration
genai.configure(api_key="your-key-here")

# Method 2: Environment variable (recommended)
import os
os.environ['GEMINI_API_KEY'] = "your-key-here"
genai.configure(api_key=os.environ['GEMINI_API_KEY'])

# Method 3: Kaggle Secrets (most secure)
from kaggle_secrets import UserSecretsClient
user_secrets = UserSecretsClient()
gemini_key = user_secrets.get_secret("GEMINI_API_KEY")
genai.configure(api_key=gemini_key)
```

**Prevention**:
- Use Kaggle Secrets for production notebooks
- Rotate API keys quarterly
- Monitor API key usage in Google Cloud Console

---

## 🤖 AGENT BEHAVIOR ISSUES

### Problem 3.1: All agents proposing identical solutions

**Symptoms**:
- Advocate, Efficiency, and Nash costs are all the same
- No visible negotiation happening
- System behaves like single-agent

**Diagnosis**:
- Agent utility functions not properly differentiated
- Weights are neutral (0.5, 0.5)
- Bug in agent initialization

**Solution**:
```python
# Check agent weights
print("Advocate utility weights:", advocate_agent.weights)
print("Efficiency utility weights:", efficiency_agent.weights)

# Should be different! If not, reinitialize:
class AdvocateAgent(BaseAgent):
    def __init__(self, model):
        super().__init__("Advocate Agent", model)
        self.sat_weight = 1.0      # Prioritize satisfaction
        self.cost_weight = 0.3     # Secondary consideration
        
class EfficiencyAgent(BaseAgent):
    def __init__(self, model):
        super().__init__("Efficiency Agent", model)
        self.sat_weight = 0.3      # Secondary consideration
        self.cost_weight = 1.0     # Prioritize cost

# Verify proposals are different
test_ticket = system.tickets_df.iloc[0].to_dict()
adv = advocate_agent.propose_strategy(test_ticket, [], {}, system.sla_rules)
eff = efficiency_agent.propose_strategy(test_ticket, [], {}, system.sla_rules)

print(f"Advocate: ${adv['estimated_cost']:.0f}, {adv['satisfaction_score']}%")
print(f"Efficiency: ${eff['estimated_cost']:.0f}, {eff['satisfaction_score']}%")
# Should show significant difference!
```

**Prevention**:
- Add unit tests for agent differentiation
- Log agent proposals before Nash equilibrium
- Set minimum spread requirement (e.g., 20% cost difference)

---

### Problem 3.2: Advocate agent too aggressive

**Symptoms**:
- All proposals are 95%+ satisfaction
- Costs are 3-5x higher than reasonable
- Nash solutions cluster near Advocate (not balanced)

**Diagnosis**:
Advocate agent weights are too extreme or SLA rules misconfigured

**Solution**:
```python
# Option 1: Reduce Advocate's satisfaction weight
class AdvocateAgent(BaseAgent):
    def propose_strategy(self, ticket, kb_results, escalation, sla_rules):
        # Instead of always 95%, scale based on tier
        tier_satisfaction = {
            "bronze": 75,
            "silver": 82,
            "gold": 90,
            "enterprise": 95
        }
        satisfaction_score = tier_satisfaction[ticket["customer_tier"]]
        
        # Cap cost multiplier
        response_time = max(1, sla_hours // 3)  # Not // 5
        estimated_cost = min(
            sla_rules[tier]["cost_per_hour"] * response_time * 1.5,
            1000  # Hard cap at $1000
        )
        # ... rest of logic

# Option 2: Add reality check
if estimated_cost > (sla_rules[tier]["cost_per_hour"] * sla_rules[tier]["sla_hours"]):
    print(f"WARNING: Advocate cost ${estimated_cost:.0f} exceeds reasonable bounds")
```

**Prevention**:
- Set maximum cost bounds in agent logic
- Use tiered satisfaction targets (not 95% for everyone)
- Monitor Advocate proposals in Dashboard 1

---

### Problem 3.3: Efficiency agent too conservative

**Symptoms**:
- All proposals are 60-70% satisfaction
- Costs are unrealistically low
- Risk of customer churn

**Diagnosis**:
Efficiency agent prioritizing cost too heavily

**Solution**:
```python
class EfficiencyAgent(BaseAgent):
    def propose_strategy(self, ticket, kb_results, escalation, sla_rules):
        # Add minimum satisfaction floor
        tier_min_satisfaction = {
            "bronze": 65,
            "silver": 70,
            "gold": 78,
            "enterprise": 85
        }
        satisfaction_score = max(
            tier_min_satisfaction[ticket["customer_tier"]],
            70  # Global minimum
        )
        
        # Adjust for high-risk tickets
        if escalation['escalation_probability'] > 0.7:
            satisfaction_score += 10  # Bump up for risky tickets
            
        # Don't go too close to SLA limit for high tiers
        if tier in ["gold", "enterprise"]:
            response_time = int(sla_hours * 0.7)  # 70% of SLA, not 90%
```

**Prevention**:
- Set minimum satisfaction thresholds
- Increase satisfaction for high-risk tickets
- Review Efficiency proposals monthly

---

### Problem 3.4: Knowledge Agent returning no results

**Symptoms**:
```
kb_results = []
Warning: No KB articles found for ticket
```

**Diagnosis**:
- KB is empty or not loaded
- Module tags don't match ticket products
- Search logic failing

**Solution**:
```python
# Debug KB contents
print(f"KB has {len(system.kb_docs)} articles")
print("Modules in KB:", system.kb_docs['module_tag'].unique())
print("Modules in tickets:", system.tickets_df['product_module'].unique())

# Check for mismatch
kb_modules = set(system.kb_docs['module_tag'].unique())
ticket_modules = set(system.tickets_df['product_module'].unique())
missing = ticket_modules - kb_modules
if missing:
    print(f"ERROR: Tickets reference modules not in KB: {missing}")

# Fix: Ensure KB covers all modules
generator = SyntheticDataGenerator()
system.kb_docs = generator.generate_kb_docs()  # Regenerate

# Verify fix
test_ticket = system.tickets_df.iloc[0].to_dict()
kb_results = system.knowledge_agent.search_solutions(test_ticket)
print(f"Found {len(kb_results)} KB articles")
```

**Prevention**:
- Validate KB completeness at initialization
- Add fallback for missing modules
- Log warnings when KB search returns empty

---

### Problem 3.5: Escalation Predictor always returns 0.5

**Symptoms**:
- All tickets show 50% escalation probability
- No differentiation between high/low risk
- Heatmap is uniform yellow

**Diagnosis**:
Feature engineering not working or model not calibrated

**Solution**:
```python
class EscalationPredictor(BaseAgent):
    def predict_escalation(self, ticket, sla_rules):
        # Enhanced feature engineering
        tier_risk = {
            "bronze": 0.15,
            "silver": 0.35,
            "gold": 0.65,
            "enterprise": 0.85
        }
        
        severity_multiplier = ticket["severity"] / 5.0
        base_risk = tier_risk[ticket["customer_tier"]] * severity_multiplier
        
        # Add urgency detection
        if "URGENT" in ticket["description"]:
            base_risk += 0.15
            
        # Add product module risk (some modules more critical)
        critical_modules = ["Security", "Billing", "API"]
        if ticket["product_module"] in critical_modules:
            base_risk += 0.10
        
        # Normalize to 0-1 range
        risk_score = max(0.0, min(1.0, base_risk))
        
        return {
            "escalation_probability": risk_score,
            "risk_level": "high" if risk_score > 0.7 else "medium" if risk_score > 0.4 else "low"
        }
```

**Testing**:
```python
# Test with different ticket types
test_cases = [
    {"customer_tier": "bronze", "severity": 1, "description": "Minor issue", "product_module": "CRM"},
    {"customer_tier": "enterprise", "severity": 5, "description": "URGENT: Critical issue", "product_module": "Security"}
]

for ticket in test_cases:
    risk = predictor.predict_escalation(ticket, system.sla_rules)
    print(f"{ticket['customer_tier']}, Sev {ticket['severity']}: {risk['escalation_probability']:.2f}")
# Should show clear differentiation!
```

**Prevention**:
- Add more features (time of day, customer history, etc.)
- Validate risk distribution matches expectations
- Periodically retrain on actual escalation data

---

## ⚖️ NASH EQUILIBRIUM PROBLEMS

### Problem 4.1: Nash solutions identical to one agent

**Symptoms**:
- Nash costs always match Advocate OR Efficiency
- No true optimization happening
- Purple dots overlap with blue or green in Dashboard 1

**Diagnosis**:
- Optimization bounds too tight
- Utility functions not properly balanced
- Solver failing to converge

**Solution**:
```python
class MediatorAgent(BaseAgent):
    def negotiate_solution(self, advocate_strategy, efficiency_strategy, ticket, escalation):
        from scipy.optimize import minimize
        
        # Define utility functions with clearer trade-offs
        def advocate_utility(x):
            satisfaction, cost = x[0], x[1]
            # Advocate cares about satisfaction, penalized by cost
            return -(satisfaction - 0.4 * (cost / 100))  # Increased cost penalty
        
        def efficiency_utility(x):
            satisfaction, cost = x[0], x[1]
            # Efficiency cares about cost, penalized by low satisfaction
            return -(-cost / 100 + 0.4 * satisfaction)  # Increased satisfaction penalty
        
        # Starting point: true midpoint
        initial_guess = [
            (advocate_strategy["satisfaction_score"] + efficiency_strategy["satisfaction_score"]) / 2,
            (advocate_strategy["estimated_cost"] + efficiency_strategy["estimated_cost"]) / 2
        ]
        
        # Wider bounds to allow exploration
        bounds = [
            (max(50, efficiency_strategy["satisfaction_score"] - 10), 
             min(100, advocate_strategy["satisfaction_score"] + 10)),
            (max(0, efficiency_strategy["estimated_cost"] * 0.7), 
             advocate_strategy["estimated_cost"] * 1.3)
        ]
        
        # Combined objective for Nash equilibrium
        result = minimize(
            lambda x: advocate_utility(x) + efficiency_utility(x),
            initial_guess,
            bounds=bounds,
            method='L-BFGS-B',
            options={'maxiter': 100}  # More iterations
        )
        
        if not result.success:
            print(f"WARNING: Nash optimization failed for {ticket['ticket_id']}")
            # Fallback: simple average
            optimal_satisfaction = initial_guess[0]
            optimal_cost = initial_guess[1]
        else:
            optimal_satisfaction = result.x[0]
            optimal_cost = result.x[1]
        
        # ... rest of logic
```

**Verification**:
```python
# After processing, check Nash is actually between agents
for r in system.results[:5]:
    adv_cost = r['advocate_proposal']['estimated_cost']
    eff_cost = r['efficiency_proposal']['estimated_cost']
    nash_cost = r['final_decision']['estimated_cost']
    
    if nash_cost < eff_cost or nash_cost > adv_cost:
        print(f"⚠️ {r['ticket_id']}: Nash ${nash_cost:.0f} outside [{eff_cost:.0f}, {adv_cost:.0f}]")
```

**Prevention**:
- Log optimization success rate
- Alert if >10% of Nash solutions are at bounds
- Periodically review utility function balance

---

### Problem 4.2: Nash equilibrium solver crashes

**Symptoms**:
```
LinAlgError: Singular matrix
ValueError: Optimization failed
```

**Diagnosis**:
- Invalid initial guess (NaN or infinity)
- Bounds are contradictory
- Utility functions return NaN

**Solution**:
```python
def negotiate_solution(self, advocate_strategy, efficiency_strategy, ticket, escalation):
    # Input validation
    try:
        adv_sat = float(advocate_strategy["satisfaction_score"])
        adv_cost = float(advocate_strategy["estimated_cost"])
        eff_sat = float(efficiency_strategy["satisfaction_score"])
        eff_cost = float(efficiency_strategy["estimated_cost"])
        
        # Check for invalid values
        if any(np.isnan([adv_sat, adv_cost, eff_sat, eff_cost])):
            raise ValueError("NaN detected in agent proposals")
        
        if any(x <= 0 for x in [adv_cost, eff_cost]):
            raise ValueError("Cost must be positive")
            
        # Ensure advocate is actually more expensive
        if adv_cost < eff_cost:
            print(f"WARNING: Swapping agent costs for {ticket['ticket_id']}")
            adv_cost, eff_cost = eff_cost, adv_cost
            
    except (KeyError, ValueError, TypeError) as e:
        print(f"ERROR in Nash negotiation: {e}")
        # Fallback to simple average
        return {
            "response_time_hours": (advocate_strategy["response_time_hours"] + 
                                   efficiency_strategy["response_time_hours"]) // 2,
            "satisfaction_score": (advocate_strategy["satisfaction_score"] + 
                                  efficiency_strategy["satisfaction_score"]) / 2,
            "estimated_cost": (advocate_strategy["estimated_cost"] + 
                              efficiency_strategy["estimated_cost"]) / 2,
            "nash_equilibrium": False,  # Flag that fallback was used
            "error": str(e)
        }
    
    # ... continue with optimization
```

**Prevention**:
- Add comprehensive input validation
- Implement graceful fallback to simple averaging
- Log all optimization failures for analysis

---

### Problem 4.3: Nash optimization is too slow

**Symptoms**:
- Each ticket takes 10+ seconds to process
- Optimization step dominates runtime
- System doesn't scale

**Diagnosis**:
- Too many optimization iterations
- Complex utility functions
- Poor initial guess

**Solution**:
```python
# Optimize for speed
result = minimize(
    lambda x: advocate_utility(x) + efficiency_utility(x),
    initial_guess,
    bounds=bounds,
    method='L-BFGS-B',
    options={
        'maxiter': 20,      # Reduce from 100
        'ftol': 1e-4,       # Less precision (faster)
        'gtol': 1e-3
    }
)

# Alternative: Use closed-form solution for simple case
def quick_nash_approximation(adv_strategy, eff_strategy):
    """
    Fast approximation: weighted average based on escalation risk
    """
    if escalation['escalation_probability'] > 0.7:
        weight = 0.7  # Closer to Advocate
    elif escalation['escalation_probability'] < 0.3:
        weight = 0.3  # Closer to Efficiency
    else:
        weight = 0.5  # Middle
    
    return {
        "satisfaction_score": (weight * adv_strategy["satisfaction_score"] + 
                               (1-weight) * eff_strategy["satisfaction_score"]),
        "estimated_cost": (weight * adv_strategy["estimated_cost"] + 
                          (1-weight) * eff_strategy["estimated_cost"]),
        # ... other fields
    }
```

**Benchmarking**:
```python
import time

start = time.time()
result = system.process_ticket(test_ticket)
elapsed = time.time() - start

print(f"Ticket processed in {elapsed:.2f}s")
# Target: <5 seconds per ticket
```

**Prevention**:
- Profile code to find bottlenecks
- Use approximation for low-stakes tickets
- Cache results for similar tickets

---

## 📊 DASHBOARD VISUALIZATION ISSUES

### Problem 5.1: Dashboards show no data

**Symptoms**:
- Empty charts with no dots/bars
- "No data to display" message
- Axes showing but no plotted elements

**Diagnosis**:
No tickets have been processed yet

**Solution**:
```python
# Ensure tickets are processed BEFORE creating visualizer
system = AdversarialSupportSystem()
results_df = system.process_batch(num_tickets=10)  # Must run this!

# Verify results exist
print(f"Processed {len(results_df)} tickets")
print(f"System has {len(system.results)} results")

# Now create visualizer
viz = DashboardVisualizer(system, results_df)
viz.display_all_dashboards()
```

**Prevention**:
- Add check in DashboardVisualizer.__init__()
- Raise clear error if results are empty
- Update documentation to show correct order

---

### Problem 5.2: Plotly charts not rendering in Kaggle

**Symptoms**:
- Code runs without error but charts don't appear
- Blank output cells
- Charts work locally but not in Kaggle

**Diagnosis**:
Plotly renderer not configured correctly for Kaggle

**Solution**:
```python
import plotly.io as pio

# Set renderer for Kaggle
pio.renderers.default = 'kaggle'

# Alternative: Use inline renderer
import plotly.graph_objects as go
fig = go.Figure(...)
fig.show(renderer='notebook')

# Or export to HTML and display
from IPython.display import HTML
fig.write_html('temp_chart.html')
display(HTML('temp_chart.html'))
```

**For Notebook**:
```python
# Add at top of notebook
import plotly.offline as pyo
pyo.init_notebook_mode(connected=True)
```

**Prevention**:
- Test dashboards in Kaggle environment before presenting
- Include renderer configuration in setup cells
- Provide alternative static image export

---

### Problem 5.3: Waterfall chart showing incorrect values

**Symptoms**:
- Bars going in wrong direction (savings showing as increase)
- Total doesn't match sum of parts
- Negative values appearing incorrectly

**Diagnosis**:
Waterfall measure types misconfigured

**Solution**:
```python
def create_cost_savings_waterfall(self):
    total_advocate = sum([r['advocate_proposal']['estimated_cost'] for r in self.results])
    total_nash = sum([r['final_decision']['estimated_cost'] for r in self.results])
    savings = total_advocate - total_nash
    
    # Verify calculations
    print(f"Advocate total: ${total_advocate:.0f}")
    print(f"Nash total: ${total_nash:.0f}")
    print(f"Savings: ${savings:.0f}")
    
    if savings < 0:
        print("⚠️ WARNING: Negative savings detected!")
    
    fig = go.Figure(go.Waterfall(
        orientation="v",
        measure=["absolute", "relative", "total"],  # Critical: correct order
        x=["Start", "Savings", "Final"],
        y=[total_advocate, -savings, total_nash],  # Note: -savings for decrease
        text=[f"${total_advocate:.0f}", f"-${savings:.0f}", f"${total_nash:.0f}"],
        decreasing={"marker": {"color": "#10b981"}},
        totals={"marker": {"color": "#a855f7"}}
    ))
    
    return fig
```

**Prevention**:
- Add data validation before plotting
- Log intermediate calculations
- Visual inspection of results

---

### Problem 5.4: Heatmap colors not meaningful

**Symptoms**:
- All cells are same color
- Color scale doesn't represent risk properly
- Can't distinguish high/low risk

**Diagnosis**:
- Risk scores not properly normalized
- Color scale range incorrect
- Data aggregation issue

**Solution**:
```python
def create_escalation_risk_heatmap(self):
    # ... data preparation ...
    
    # Check risk score distribution
    risk_values = risk_df['risk'].values
    print(f"Risk range: {risk_values.min():.2f} to {risk_values.max():.2f}")
    print(f"Risk mean: {risk_values.mean():.2f}")
    
    if risk_values.max() - risk_values.min() < 0.1:
        print("⚠️ WARNING: Low risk variance - heatmap will be uniform")
    
    # Create pivot table with proper aggregation
    pivot = risk_df.pivot_table(
        values='risk',
        index='severity',
        columns='tier',
        aggfunc='mean'  # Average multiple tickets per cell
    )
    
    # Ensure color scale matches data range
    fig = go.Figure(data=go.Heatmap(
        z=pivot.values,
        x=[t.title() for t in pivot.columns],
        y=pivot.index,
        colorscale='RdYlGn_r',  # Red-Yellow-Green reversed
        zmin=0,    # Force scale from 0
        zmax=1,    # to 1
        colorbar=dict(title="Risk<br>Score")
    ))
    
    return fig
```

**Prevention**:
- Validate risk score distribution
- Use consistent color scales across dashboards
- Add data quality checks

---

### Problem 5.5: Pareto frontier not visible

**Symptoms**:
- Purple line missing or hidden
- All dots appear gray
- Frontier doesn't highlight optimal solutions

**Diagnosis**:
- Pareto calculation logic error
- Z-order issue (frontier drawn behind dots)
- No truly optimal solutions in dataset

**Solution**:
```python
def create_pareto_frontier(self):
    # ... prepare data ...
    
    # Calculate Pareto frontier correctly
    pareto_points = []
    sorted_df = df.sort_values('cost')
    
    max_satisfaction = 0
    for _, row in sorted_df.iterrows():
        if row['satisfaction'] >= max_satisfaction:
            pareto_points.append(row)
            max_satisfaction = row['satisfaction']
    
    pareto_df = pd.DataFrame(pareto_points)
    
    print(f"Found {len(pareto_df)} Pareto optimal solutions out of {len(df)}")
    
    if len(pareto_df) == 0:
        print("⚠️ WARNING: No Pareto optimal solutions found!")
        return go.Figure()  # Return empty figure
    
    fig = go.Figure()
    
    # Draw all points FIRST (behind)
    fig.add_trace(go.Scatter(
        x=df['cost'], y=df['satisfaction'],
        mode='markers', name='All Solutions',
        marker=dict(size=8, color='#64748b', opacity=0.5)
    ))
    
    # Draw frontier SECOND (on top)
    fig.add_trace(go.Scatter(
        x=pareto_df['cost'], y=pareto_df['satisfaction'],
        mode='lines+markers', name='Pareto Frontier',
        line=dict(color='#a855f7', width=4),
        marker=dict(size=14, color='#a855f7', symbol='diamond')
    ))
    
    return fig
```

**Prevention**:
- Test Pareto calculation with known datasets
- Verify trace order (background first, frontier last)
- Add visual markers to distinguish frontier points

---

## 📁 DATA QUALITY ISSUES

### Problem 6.1: Synthetic tickets are too similar

**Symptoms**:
- All tickets have same cost/satisfaction patterns
- No diversity in agent negotiations
- Dash