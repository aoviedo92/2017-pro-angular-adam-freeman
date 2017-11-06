import {Injectable} from "@angular/core";
import {Http, Request, RequestMethod, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Product} from "./product.model";
import {Cart} from "./cart.model";
import {Order} from "./order.model";
import "rxjs/add/operator/map";
const PROTOCOL = "http";
const PORT = 3500;
@Injectable()
export class RestDataSource {
    baseUrl: string;
    auth_token: string;

    constructor(private http: Http) {
        this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/api/`;
    }

    getProducts(): Observable<Product[]> {
        return this.sendRequest(RequestMethod.Get, "products");
        // return this.http.get(this.baseUrl + 'products').map(response => response.json());
    }

    saveProduct(product: Product): Observable<Product> {
        return this.sendRequest(RequestMethod.Post, "products", product, true);
    }

    updateProduct(product): Observable<Product> {
        return this.sendRequest(RequestMethod.Put, `products/${product.id}`, product, true);
    }

    deleteProduct(id: number): Observable<Product> {
        return this.sendRequest(RequestMethod.Delete, `products/${id}`, null, true);
    }

    getOrders(): Observable<Order[]> {
        return this.sendRequest(RequestMethod.Get, "orders", null, true);
    }

    deleteOrder(id: number): Observable<Order> {
        return this.sendRequest(RequestMethod.Delete, `orders/${id}`, null, true);
    }

    updateOrder(order: Order): Observable<Order> {
        return this.sendRequest(RequestMethod.Put, `orders/${order.id}`, order, true);
    }

    saveOrder(order: Order): Observable<Order> {
        return this.sendRequest(RequestMethod.Post, "orders", order);
    }

    authenticate(user: string, pass: string): Observable<boolean> {
        return this.http.request(new Request({
            method: RequestMethod.Post,
            url: this.baseUrl + "login",
            body: {name: user, password: pass}
        })).map(response => {
            let r = response.json();
            this.auth_token = r.success ? r.token : null;
            return r.success;
        });
        // return this.http.post(this.baseUrl + "login", {name: user, password: pass}).map(response => {
        //     let r = response.json();
        //     this.auth_token = r.success ? r.token : null;
        //     return r.success;
        // });
    }

    private sendRequest(verb: RequestMethod,
                        url: string,
                        body?: Product | Order,
                        auth: boolean = false): Observable<Product | Product[] | Order | Order[]> {
        let request = new Request({
            method: verb,
            url: this.baseUrl + url,
            body: body,
            // headers: new Headers({
            //     "abc": "123",
            // })
        });

        if (auth && this.auth_token != null) {
            let token = `Bearer<${this.auth_token}>`;
            request.headers.append("Authorization", token);
            // console.log('rest.datasource', 'se ha autenticado. el token es', token);
        }
        // console.log('rest.datasource', 'todos los headers', request.headers.toJSON());
        return this.http.request(request).map(response => response.json());
    }
}