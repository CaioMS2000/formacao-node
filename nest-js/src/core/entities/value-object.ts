export abstract class ValueObject<Props>{
    protected props: Props

    protected constructor(props: Props){
        this.props = props
    }

    equals(other: ValueObject<unknown>){
        if(other === null || other === undefined) return false;
        if(other.props === undefined ) return false;

        return JSON.stringify(this.props) === JSON.stringify(other.props)
    }
}