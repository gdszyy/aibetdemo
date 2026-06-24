export class BaseNode {
    public id: string | number | null = null;
    public key: string = '';
    public name: string = '';
    public parent: BaseNode | null = null;
    public children: BaseNode[] = [];

    concatChildren(children: BaseNode[]): void {
        children.forEach((child) => {
            child.parent = this;
        });
        this.children = [...this.children, ...children];
    }

    setChildren(children: BaseNode[]): void {
        children.forEach((child) => {
            child.parent = this;
        });
        this.children = children;
    }

    copy(toNode: BaseNode): void {
        toNode.key = this.key;
        toNode.id = this.id;
        toNode.name = this.name;
        toNode.children = this.children;
        if (this.parent) {
            toNode.parent = this.parent.clone();
            // Replace this node with toNode in parent's children
            toNode.parent.children = toNode.parent.children.map((child) => (child.key === this.key ? toNode : child));
        }
    }

    clone(): BaseNode {
        throw new Error('Method not implemented.');
    }

    root(): RootNode {
        let current: BaseNode = this;
        while (current.parent) {
            current = current.parent;
        }
        return current as RootNode;
    }

    get ancestors(): BaseNode[] {
        const result: BaseNode[] = [];
        let current: BaseNode | null = this;
        while (current) {
            result.unshift(current);
            current = current.parent;
        }
        return result;
    }

    get lastChild(): BaseNode | null {
        if (this.children.length === 0) {
            return null;
        }
        return this.children[this.children.length - 1];
    }
}

export class TournamentNode extends BaseNode {
    public count: number | null = null;
    /** Whether this is a top/hot tournament */
    public is_top: boolean = false;

    constructor(
        public readonly tournament_id: string,
        public readonly category_id: string,
        public readonly sport_id: string,
    ) {
        super();
        this.key = `TOURNAMENT-${this.tournament_id}-${this.category_id}-${this.sport_id}`;
    }
}

export class CategoryNode extends BaseNode {
    public count: number | null = null;
    public children: TournamentNode[] = [];

    constructor(
        public readonly category_id: string,
        public readonly sport_id: string,
    ) {
        super();
        this.key = `CATEGORY-${this.category_id}-${this.sport_id}`;
    }

    clone(): CategoryNode {
        const clonedNode = new CategoryNode(this.category_id, this.sport_id);
        clonedNode.count = this.count;
        this.copy(clonedNode);
        return clonedNode;
    }
}

export class SportNode extends BaseNode {
    public children: (CategoryNode | TournamentNode)[] = [];
    /** Whether this sport is coming soon (hardcoded in frontend) */
    public isComingSoon: boolean = false;

    constructor(public sport_id: string) {
        super();
        this.key = `SPORT-${this.sport_id}`;
    }

    get categoryList(): CategoryNode[] {
        return this.children.filter((child) => child instanceof CategoryNode);
    }

    get tournamentList(): TournamentNode[] {
        return this.children.filter((child) => child instanceof TournamentNode);
    }

    clone(): SportNode {
        const clonedNode = new SportNode(this.sport_id);
        clonedNode.isComingSoon = this.isComingSoon;
        this.copy(clonedNode);
        return clonedNode;
    }
}

export class RootNode extends BaseNode {
    public children: SportNode[] = [];

    constructor() {
        super();
        this.key = 'root';
    }

    findNode(key: string): BaseNode | null {
        const stack: BaseNode[] = [...this.children];

        while (stack.length > 0) {
            const currentNode = stack.pop();
            if (!currentNode) {
                continue;
            }
            if (currentNode.key === key) {
                return currentNode;
            }
            stack.push(...currentNode.children);
        }
        return null;
    }

    findLeafNodes(tournament_id: string): BaseNode[] {
        const result: BaseNode[] = [];
        const stack: BaseNode[] = [...this.children];

        while (stack.length > 0) {
            const currentNode = stack.pop();
            if (!currentNode) {
                continue;
            }
            if (currentNode.children.length > 0) {
                stack.push(...currentNode.children);
                continue;
            }
            if ((currentNode as TournamentNode).tournament_id === tournament_id) {
                result.push(currentNode);
            }
        }

        return result;
    }

    clone(): RootNode {
        const clonedNode = new RootNode();
        this.copy(clonedNode);
        return clonedNode;
    }
}
