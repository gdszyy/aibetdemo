# GOTO Sports Betting

This context captures domain language for sports betting features in GOTO.

## Language

**串关加赔玩法**:
用户串关投注满足配置规则并中奖时获得额外加赔的常驻玩法。
_Avoid_: 活动

**加赔配置**:
控制某个区域内**串关加赔玩法**生效窗口、适用范围、阶梯和封顶规则的一份版本化规则。
_Avoid_: 活动配置、当前生效活动

**加赔记录**:
某笔注单进入**串关加赔玩法**后，用于追踪其锁定配置版本和派发状态的记录。
_Avoid_: BIND、活动绑定记录

**加赔展示状态**:
前端用于呈现**加赔记录**所处阶段的状态分类。
_Avoid_: 注单状态、后端状态契约

**加赔预览状态**:
前端在下单前展示**串关加赔玩法**预览结果可用性的状态分类。
_Avoid_: 加赔展示状态、加赔记录状态

## Relationships

- **串关加赔玩法** has zero or one current **加赔配置** per region
- A **加赔配置** can apply to many **加赔记录**
- A **加赔记录** belongs to exactly one 注单
- A **加赔展示状态** describes one **加赔记录** in the user interface
- A **加赔预览状态** exists before an 注单 creates an **加赔记录**

## Example Dialogue

> **Dev:** "用户下单时命中了串关加赔玩法，我们要复制整份加赔配置吗？"
> **Domain expert:** "不用复制整份规则；加赔记录只需要锁定那一版加赔配置，结算时再按该版本重算。"

## Flagged Ambiguities

- "活动" was used to mean both **串关加赔玩法** and **加赔配置** — resolved: domain models use **串关加赔玩法** for the permanent play type and **加赔配置** for the versioned rule set; "活动" remains user-facing or operations copy only.
- "加赔记录状态" was discussed as an implementation contract — resolved: for now it is only **加赔展示状态**, a front-end display model; backend response fields are not decided.
- "全局唯一配置" was ambiguous between platform-wide and regional uniqueness — resolved: **加赔配置** is unique within a region at a point in time, not across the whole platform.
- "加赔状态" could mean either pre-submit preview availability or post-submit record display — resolved: **加赔预览状态** and **加赔展示状态** are separate front-end models.
- Whether anonymous users can request **加赔预览状态** is unresolved; do not assume login-gated or anonymous preview behavior until this is decided.
